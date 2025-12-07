import { pool } from "../../config/db";

const createBooking = async (
    customer_id: number,
    vehicle_id: number,
    rent_start_date: string,
    rent_end_date: string
) => {

    const vehicleRes = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`,
        [vehicle_id]
    );

    if (vehicleRes.rows.length === 0) {
        throw new Error("Vehicle is not available");
    }

    const vehicle = vehicleRes.rows[0];

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) throw new Error("rent_end_date must be after rent_start_date");

    const total_price = Number(vehicle.daily_rent_price) * days;

    const bookingRes = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    const booking = bookingRes.rows[0];

    await pool.query(
        `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
        [vehicle_id]
    );

    return {
        ...booking,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price,
        },
    };
};

const getBookings = async (loggedInUser: { id: number, role: string }) => {
    if (loggedInUser.role === "admin") {
        let formatted = await pool.query(`
            SELECT 
            b.*, 
            u.name AS customer_name,
            u.email AS customer_email,
            v.vehicle_name,
            v.registration_number
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id;
`);
        const result = formatted.rows.map(row => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: Number(row.total_price),
            status: row.status,
            customer: {
                name: row.customer_name,
                email: row.customer_email
            },
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number
            }
        }));

        return result;
    }
    else {
        const formatted = await pool.query(`
            SELECT 
            b.id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            v.vehicle_name,
            v.registration_number,
            v.type
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = $1;
`, [loggedInUser.id]);
        const result = formatted.rows.map(row => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: Number(row.total_price),
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type
            }
        }));
        return result;
    }
};

const updateBooking = async (
    bookingId: number,
    status: "cancelled" | "returned",
    loggedInUser: { id: number; role: string }
) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (result.rows.length === 0) {
        throw new Error("Booking not found");
    }

    const booking = result.rows[0];

    if (loggedInUser.role === "customer") {
        if (booking.customer_id !== loggedInUser.id) {
            throw new Error("Unauthorized");
        }
        else if (status === "cancelled") {
            const today = new Date();
            if (new Date(booking.rent_start_date) <= today) {
                throw new Error("Cannot cancel booking after start date");
            }
            await pool.query(
                `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
                [bookingId]
            );
            await pool.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                [booking.vehicle_id]
            );
        }
    } else if (loggedInUser.role === "admin") {
        if (status === "returned") {
            await pool.query(
                `UPDATE bookings SET status = 'returned' WHERE id = $1`,
                [bookingId]
            );
            await pool.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                [booking.vehicle_id]
            );
        }
    } else {
        throw new Error("Unauthorized");
    }

    const updated = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    return updated.rows[0];
};

export const bookingServices = {
    createBooking,
    getBookings,
    updateBooking,

}
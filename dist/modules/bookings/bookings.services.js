"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const db_1 = require("../../config/db");
const createBooking = (customer_id, vehicle_id, rent_start_date, rent_end_date) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBookingRes = yield db_1.pool.query(`SELECT * FROM bookings
     WHERE customer_id = $1
     AND rent_end_date >= $2
     AND rent_start_date <= $3`, [customer_id, rent_start_date, rent_end_date]);
    if (existingBookingRes.rows.length > 0) {
        throw new Error("Customer already has a booking during this period");
    }
    const vehicleRes = yield db_1.pool.query(`SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`, [vehicle_id]);
    if (vehicleRes.rows.length === 0) {
        throw new Error("Vehicle is not available");
    }
    const vehicle = vehicleRes.rows[0];
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0)
        throw new Error("rent_end_date must be after rent_start_date");
    const total_price = Number(vehicle.daily_rent_price) * days;
    const bookingRes = yield db_1.pool.query(`INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);
    const booking = bookingRes.rows[0];
    yield db_1.pool.query(`UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);
    return Object.assign(Object.assign({}, booking), { vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price,
        } });
});
const getBookings = (loggedInUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (loggedInUser.role === "admin") {
        let formatted = yield db_1.pool.query(`
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
        const formatted = yield db_1.pool.query(`
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
});
const updateBooking = (bookingId, status, loggedInUser) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const result = yield db_1.pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (result.rows.length === 0) {
        throw new Error("Booking not found");
    }
    const booking = result.rows[0];
    if (new Date(booking.rent_end_date) <= today && booking.status !== "returned") {
        yield db_1.pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [bookingId]);
        yield db_1.pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [booking.vehicle_id]);
        booking.status = "returned";
        if (status === "cancelled") {
            throw new Error("Cannot cancel booking after end date. Booking auto-returned");
        }
    }
    if (loggedInUser.role === "customer") {
        if (status === "cancelled") {
            if (new Date(booking.rent_start_date) <= today) {
                throw new Error("Cannot cancel booking after start date");
            }
            yield db_1.pool.query(`UPDATE bookings SET status = 'cancelled' WHERE id = $1`, [bookingId]);
            yield db_1.pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [booking.vehicle_id]);
        }
    }
    else if (loggedInUser.role === "admin") {
        if (status === "returned") {
            yield db_1.pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [bookingId]);
            yield db_1.pool.query(`UPDATE vehicles SET availability_status = 'available' WHERE id = $1`, [booking.vehicle_id]);
        }
    }
    else {
        throw new Error("Unauthorized");
    }
    const updated = yield db_1.pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    return updated.rows[0];
});
exports.bookingServices = {
    createBooking,
    getBookings,
    updateBooking,
};

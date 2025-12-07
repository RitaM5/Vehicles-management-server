import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        const result = await bookingServices.createBooking(
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date
        );

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const getBookings = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const loggedInUser = {
            id: req.user.id,
            role: req.user.role
        };
        const result = await bookingServices.getBookings(loggedInUser);

        res.status(200).json({
            success: true,
            message:
                loggedInUser.role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        // const loggedInUser = req.user!;
        const loggedInUser = {
            id: req.user.id,
            role: req.user.role
        };
        const bookingId = Number(req.params.bookingId);
        const { status } = req.body;

        const result = await bookingServices.updateBooking(bookingId, status, loggedInUser);

        res.status(200).json({
            success: true,
            message:
                status === "cancelled"
                    ? "Booking cancelled successfully"
                    : "Booking marked as returned. Vehicle is now available",
            data: result,
        });
    } catch (err: any) {
        res.status(err.message.includes("Unauthorized") ? 403 : 400).json({
            success: false,
            message: err.message,
        });
    }
};
export const bookingController = {
    createBooking,
    getBookings,
    updateBooking,
}
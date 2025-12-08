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
exports.bookingController = exports.updateBooking = exports.getBookings = exports.createBooking = void 0;
const bookings_services_1 = require("./bookings.services");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;
        const result = yield bookings_services_1.bookingServices.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
});
exports.createBooking = createBooking;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield bookings_services_1.bookingServices.getBookings(loggedInUser);
        res.status(200).json({
            success: true,
            message: result.length === 0
                ? loggedInUser.role === "admin"
                    ? "No bookings found"
                    : "You have no bookings yet"
                : loggedInUser.role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
exports.getBookings = getBookings;
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const bookingId = Number(req.params.bookingId);
        const { status } = req.body;
        const result = yield bookings_services_1.bookingServices.updateBooking(bookingId, status, loggedInUser);
        if (loggedInUser.role === 'admin') {
            if (status === 'returned') {
                return res.status(200).json({
                    success: true,
                    message: "Booking marked as returned. Vehicle is now available",
                    data: result,
                });
            }
            return res.status(401).json({
                success: false,
                message: "You can't change cancel status",
            });
        }
        else if (loggedInUser.role === 'customer') {
            if (status === 'cancelled') {
                return res.status(200).json({
                    success: true,
                    message: "Booking cancelled successfully",
                    data: result,
                });
            }
            return res.status(401).json({
                success: false,
                message: "You can't change return status",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
exports.updateBooking = updateBooking;
exports.bookingController = {
    createBooking: exports.createBooking,
    getBookings: exports.getBookings,
    updateBooking: exports.updateBooking,
};

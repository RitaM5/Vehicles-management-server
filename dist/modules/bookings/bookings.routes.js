"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bookings_controller_1 = require("./bookings.controller");
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const router = express_1.default.Router();
router.post("/bookings", (0, authValidation_1.default)("admin", "customer"), bookings_controller_1.bookingController.createBooking);
router.get("/bookings", (0, authValidation_1.default)("admin", "customer"), bookings_controller_1.bookingController.getBookings);
router.put("/bookings/:bookingId", (0, authValidation_1.default)("admin", "customer"), bookings_controller_1.bookingController.updateBooking);
exports.bookingsRoutes = router;

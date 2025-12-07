import express from "express";
import { bookingController } from "./bookings.controller";
import auth from "../../middleware/authValidation";

const router = express.Router();

router.post("/bookings", auth("admin", "customer"), bookingController.createBooking);
router.get("/bookings", auth("admin", "customer"), bookingController.getBookings);
router.put("/bookings/:bookingId", auth("admin", "customer"), bookingController.updateBooking);

export const bookingsRoutes = router;
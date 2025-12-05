import express from "express";
import { vehicleRoutes } from "../modules/vehicles/vehicles.routes";
import { authRoutes } from "../modules/auth/auth.routes";

const router = express.Router();

// router.use("/api/v1/auth", authRoutes);
// router.use("/api/v1/users", userRoutes);
router.use("/api/v1/vehicles", vehicleRoutes);
router.use("/api/v1/auth/signup", authRoutes);
// router.use("/api/v1/bookings", bookingRoutes);

export default router;
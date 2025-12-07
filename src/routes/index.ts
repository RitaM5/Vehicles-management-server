import express from "express";
import { vehicleRoutes } from "../modules/vehicles/vehicles.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";
import { bookingsRoutes } from "../modules/bookings/bookings.routes";

const router = express.Router();

router.use("/api/v1", vehicleRoutes);
router.use("/api/v1", authRoutes);
router.use("/api/v1", userRoutes);
router.use("/api/v1", bookingsRoutes);


export default router;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicles_routes_1 = require("../modules/vehicles/vehicles.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const bookings_routes_1 = require("../modules/bookings/bookings.routes");
const router = express_1.default.Router();
router.use("/api/v1", vehicles_routes_1.vehicleRoutes);
router.use("/api/v1", auth_routes_1.authRoutes);
router.use("/api/v1", user_routes_1.userRoutes);
router.use("/api/v1", bookings_routes_1.bookingsRoutes);
exports.default = router;

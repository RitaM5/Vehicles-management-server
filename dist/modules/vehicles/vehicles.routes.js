"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vehecles_controller_1 = require("./vehecles.controller");
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const router = express_1.default.Router();
router.post("/vehicles", (0, authValidation_1.default)('admin'), vehecles_controller_1.vehicleControllers.createVehicleDb);
router.get("/vehicles", vehecles_controller_1.vehicleControllers.getVehicleDb);
router.get("/vehicles/:vehicleId", vehecles_controller_1.vehicleControllers.getSingleVehicle);
router.put("/vehicles/:vehicleId", (0, authValidation_1.default)("admin"), vehecles_controller_1.vehicleControllers.updateVehicles);
router.delete("/vehicles/:vehicleId", (0, authValidation_1.default)("admin"), vehecles_controller_1.vehicleControllers.deleteVehicle);
exports.vehicleRoutes = router;

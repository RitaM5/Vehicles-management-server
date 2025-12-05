import express from "express";
import { vehicleControllers } from "./vehecles.controller";


const router = express.Router();

// router.post("/", verifyToken, isAdmin, createVehicle);
// router.get("/", getAllVehicles);
// router.get("/:vehicleId", getVehicleById);
// router.put("/:vehicleId", verifyToken, isAdmin, updateVehicle);
// router.delete("/:vehicleId", verifyToken, isAdmin, deleteVehicle);

router.post("/", vehicleControllers.createVehicleDb);
router.get("/", vehicleControllers.getVehicleDb);
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);
router.put("/:vehicleId", vehicleControllers.updateVehicles);
router.delete("/:vehicleId", vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
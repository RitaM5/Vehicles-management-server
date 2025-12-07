import express from "express";
import { vehicleControllers } from "./vehecles.controller";
import auth from "../../middleware/authValidation";

const router = express.Router();

router.post("/vehicles", auth('admin'), vehicleControllers.createVehicleDb);
router.get("/vehicles/", vehicleControllers.getVehicleDb);
router.get("/vehicles/:vehicleId", vehicleControllers.getSingleVehicle);
router.put("/vehicles/:vehicleId", auth("admin"), vehicleControllers.updateVehicles);
router.delete("//vehicles:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services";

const createVehicleDb = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicleDb(req.body);
        res.status(201).json({
            success: true,
            message: "data inserted successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err,
        });
    }
};

const getVehicleDb = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicleDb();
        if (result.rows.length === 0) {
            res.status(200).json({
                success: true,
                message: "No vehicles found",
                "data": []
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "vehicles retrieved successfully",
                data: result.rows
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err,
        });
    }
};

const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getSingleVehicle(req.params.vehicleId as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No vehicles found",
                data:[],
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle fetched successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err,
        });
    }
};

const updateVehicles = async (req: Request, res: Response) => {
  const {vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
  try {
    const result = await vehicleServices.updateVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const deleteVehicle =  async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.deleteVehicle(req.params.vehicleId!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const vehicleControllers = {
    createVehicleDb,
    getVehicleDb,
    getSingleVehicle,
    updateVehicles,
    deleteVehicle,
}
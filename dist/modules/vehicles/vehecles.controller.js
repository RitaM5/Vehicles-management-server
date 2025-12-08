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
exports.vehicleControllers = void 0;
const vehicles_services_1 = require("./vehicles.services");
const createVehicleDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield vehicles_services_1.vehicleServices.createVehicleDb(req.body);
        res.status(201).json({
            success: true,
            message: "data inserted successfully",
            data: result.rows[0]
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err,
        });
    }
});
const getVehicleDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield vehicles_services_1.vehicleServices.getVehicleDb();
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
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err,
        });
    }
});
const getSingleVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield vehicles_services_1.vehicleServices.getSingleVehicle(req.params.vehicleId);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No vehicles found",
                data: [],
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle fetched successfully",
                data: result.rows[0],
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err,
        });
    }
});
const updateVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = yield vehicles_services_1.vehicleServices.updateVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.vehicleId);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: result.rows[0],
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err,
        });
    }
});
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield vehicles_services_1.vehicleServices.deleteVehicle(req.params.vehicleId);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            error: err,
        });
    }
});
exports.vehicleControllers = {
    createVehicleDb,
    getVehicleDb,
    getSingleVehicle,
    updateVehicles,
    deleteVehicle,
};

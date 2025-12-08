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
exports.vehicleServices = void 0;
const db_1 = require("../../config/db");
const createVehicleDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = yield db_1.pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)  Values($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return result;
});
const getVehicleDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`SELECT * from vehicles`);
    return result;
});
const getSingleVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    return result;
});
const updateVehicle = (vehicle_name, type, registration_number, daily_rent_price, availability_status, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);
    return result;
});
const deleteVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`DELETE FROM vehicles
         WHERE id = $1
         AND id NOT IN (
             SELECT vehicle_id
             FROM bookings
             WHERE status = 'active'
         )`, [id]);
    return result;
});
exports.vehicleServices = {
    createVehicleDb,
    getVehicleDb,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};

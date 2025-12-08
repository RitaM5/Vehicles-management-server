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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = __importDefault(require("./config"));
exports.pool = new pg_1.Pool({
    connectionString: `${config_1.default.connection_str}`
});
const dataBase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,        
    type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC(10, 2) CHECK (daily_rent_price > 0) NOT NULL,
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available' 
    )`);
    yield exports.pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                       
    name VARCHAR(100) NOT NULL,                  
    email VARCHAR(100) UNIQUE NOT NULL,             
    password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 6),               
    phone VARCHAR(20) NOT NULL, 
    role VARCHAR(20) CHECK (role IN ('admin', 'customer')) DEFAULT 'customer'
    )`);
    yield exports.pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_email_lower 
    ON users (LOWER(email))
   `);
    yield exports.pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY, 
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL, 
    rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date), 
    total_price NUMERIC(10, 2) CHECK (total_price > 0) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active'
);
        `);
});
exports.default = dataBase;

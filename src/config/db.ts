import {Pool} from "pg";
import config from "./config";


export const pool = new Pool({
    connectionString: `${config.connection_str}`
});

const dataBase = async() => {
   await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,        
    type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC(10, 2) CHECK (daily_rent_price > 0) NOT NULL,
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available' 
    )`);
};
export default dataBase;
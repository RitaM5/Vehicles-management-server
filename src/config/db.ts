import { Pool } from "pg";
import config from "./config";


export const pool = new Pool({
    connectionString: `${config.connection_str}`
});

const dataBase = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,        
    type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC(10, 2) CHECK (daily_rent_price > 0) NOT NULL,
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available' 
    )`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                       
    name VARCHAR(100) NOT NULL,                  
    email VARCHAR(100) UNIQUE NOT NULL,             
    password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 6),               
    phone VARCHAR(20) NOT NULL, 
    role VARCHAR(20) CHECK (role IN ('admin', 'customer')) DEFAULT 'customer'
    )`);
    
    await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_email_lower 
    ON users (LOWER(email))
   `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY, 
    customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
    vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL, 
    rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date), 
    total_price NUMERIC(10, 2) CHECK (total_price > 0) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active'
);
        `)
};
export default dataBase;
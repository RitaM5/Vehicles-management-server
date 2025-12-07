import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import config from "../../config/config";

const signUp = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role} = payload;
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const result = await pool.query(`INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, LOWER($2), $3, $4, $5) RETURNING *`, [name, email, hashedPassword, phone, role || "customer"]);
    return result;
};

const signIn = async(email:string, password: string) => {
 const result = await pool.query(`SELECT * FROM users WHERE LOWER(email) = LOWER($1)`, [email]);
 if(result.rows.length === 0){
    return {
        success: false,
        message: "User not found !",
        data: null
    }
 }
 const user = result.rows[0];
 const match = await bcrypt.compare(password, user.password);
 if(!match){
    return{
        success: false,
        message: "Incorrect password",
        data: null
    }
 }
     const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role}, config.jwtSecret as string, {
        expiresIn : "7d",
     });

     return {
        token, user
     }
}

export const authServices = {
    signUp,
    signIn
}
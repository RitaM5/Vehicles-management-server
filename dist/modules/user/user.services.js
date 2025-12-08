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
exports.userServices = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`SELECT * FROM users`);
    return result;
});
const updateUser = (payload, id, loggedInUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = payload;
    let hashedPassword = null;
    if (password) {
        hashedPassword = yield bcrypt_1.default.hash(password, 10);
    }
    let result;
    if (loggedInUser.role === 'admin') {
        result = yield db_1.pool.query(`UPDATE users SET
        name = COALESCE($1, name),
        email = COALESCE(LOWER($2), email),
        password = COALESCE($3, password),
        role = COALESCE($4, role)
        WHERE id=$5 RETURNING *`, [name, email, hashedPassword, role, id]);
    }
    else if (loggedInUser.role === 'customer' && loggedInUser.id === id) {
        result = yield db_1.pool.query(`
            UPDATE users SET
            name = COALESCE($1, name),
            email = COALESCE(LOWER($2), email),
            password = COALESCE($3, password)
            WHERE id = $4
            RETURNING *;`, [name, email, hashedPassword, id]);
    }
    else {
        throw new Error("Unauthorized: Cannot update other users");
    }
    return result.rows[0];
});
// const deleteUser = async (id: string) => {
//     const result = await pool.query(`DELETE FROM users WHERE id=$1  AND id NOT IN (
//         SELECT customer_id
//         FROM bookings
//         WHERE status = 'active')`, [id])
//     return result;
// }
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.pool.query(`
        DELETE FROM users u
        WHERE u.id = $1
        AND NOT EXISTS (
            SELECT 1
            FROM bookings b
            WHERE b.customer_id = u.id
            AND LOWER(TRIM(b.status)) = 'active'
        )
    `, [id]);
    return result;
});
exports.userServices = {
    getUser,
    updateUser,
    deleteUser
};

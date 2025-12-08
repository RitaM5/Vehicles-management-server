import { pool } from "../../config/db"
import bcrypt from "bcrypt";

const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
};

const updateUser = async (payload: Record<string, unknown>, id: number, loggedInUser: { id: number; role: string }) => {
    const { name, email, password, role } = payload;
    let hashedPassword = null;
    if (password) {
        hashedPassword = await bcrypt.hash(password as string, 10);
    }
    let result;
    if (loggedInUser.role === 'admin') {
        result = await pool.query(`UPDATE users SET
        name = COALESCE($1, name),
        email = COALESCE(LOWER($2), email),
        password = COALESCE($3, password),
        role = COALESCE($4, role)
        WHERE id=$5 RETURNING *`, [name, email, hashedPassword, role, id]);
    }
    else if (loggedInUser.role === 'customer' && loggedInUser.id === id) {
        result = await pool.query(
            `
            UPDATE users SET
            name = COALESCE($1, name),
            email = COALESCE(LOWER($2), email),
            password = COALESCE($3, password)
            WHERE id = $4
            RETURNING *;`,
            [name, email, hashedPassword, id]
        );
    }
    else {
        throw new Error("Unauthorized: Cannot update other users");
    }

    return result.rows[0];
};

const deleteUser = async (id: number) => {
    const result = await pool.query(`
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
}

export const userServices = {
    getUser,
    updateUser,
    deleteUser
}
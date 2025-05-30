import pool from "./db.js";

export async function getUser(email) {
    try {
        const response = await pool.query(
            `SELECT * FROM users WHERE user_mail = $1`, 
            [email]
        );
        return response.rows[0];
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
        return "Error"
    }
}

export async function createUser(user_name, user_mail, user_password) {
    try {
        const response = await pool.query(
            `INSERT INTO users (name,email,password) VALUES ($1, $2, $3)`, 
            [user_name, user_mail, user_password]
        );
        return response.rows[0];
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
}

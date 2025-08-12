import pool from "./db.js";

export async function getUser(email) {
  try {
    const response = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return response.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function createUser(name, email, password) {
    if(!name || !email || !password){
        throw new Error("All fields must requrired");
    }
  try {
    const response = await pool.query(
      `INSERT INTO users (name,email,password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, password]
    );
    return response.rows[0];
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}
export async function getUserById(id) {
    try{
      const response = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
      [id]);
      return response.rows[0] || null;
    } catch(error){
      console.log(error);
      throw error;
    }
}

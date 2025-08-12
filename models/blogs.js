import { log } from "console";
import pool from "./db.js";

export async function getAllBlogs() {
    const result = await pool.query(`
        SELECT 
            blogs.id,
            blogs.title,
            blogs.content,
            blogs.created_at,
            users.name AS author
        FROM blogs
        JOIN users ON blogs.user_id = users.id
        ORDER BY blogs.created_at DESC
    `);
    return result.rows;
}
export async function getBlogById(id) {
    try {
        const response = await pool.query(`
            SELECT blogs.*, users.name AS author FROM blogs JOIN users ON blogs.user_id = users.id WHERE blogs.id = $1
            `, [id]);
        console.log(response.rows[0]);
        return response.rows[0] || null;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getBlogsByUserId(userId) {
    try {
        const result = await pool.query(
            `SELECT * FROM blogs WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching blogs for user:", error);
        throw error;
    }
}

export async function createBlog(title, content, userId) {
    try {
        const result = await pool.query(
            `INSERT INTO blogs (title, content, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [title, content, userId]
        ); 
    } catch(error){
        console.error(error);
        throw error;
    }
}

export async function deleteBlogById(blogId,userId) {
    try{
        const result = await pool.query(
            "DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING *",
            [blogId, userId]
        );
        return result.rowCount>0;
    } catch(error){
        console.error(error);
        throw error;
    }
}
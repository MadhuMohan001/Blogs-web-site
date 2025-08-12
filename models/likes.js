import pool from "./db.js";

export async function toggleLike(userId,blogId) {
    const check = await pool.query(`
        SELECT 1 FROM likes WHERE user_id = $1 AND blog_id = $2
        `,[userId,blogId]);
    if(check.rows.length>0){
        await pool.query(`
            DELETE FROM likes WHERE user_id = $1 AND blog_id = $2
            `,[userId,blogId]);
    } else {
        await pool.query(`
            INSERT INTO likes (user_id, blog_id) VALUES ($1, $2)
            `,[userId,blogId]);
    }
    const countResult = await pool.query(`
        SELECT COUNT(*) AS count FROM likes WHERE blog_id = $1
        `,[blogId]);
    return parseInt(countResult.rows[0].count,10);
}
export async function getLikeCount(blogId) {
    const result = await pool.query(`
        SELECT COUNT(*) AS count FROM likes WHERE blog_id = $1
        `,[blogId]);
    return parseInt(result.rows[0].count,10);
}
export async function getAllBlogsWithLikes(userId) {
    const query = `
    SELECT b.*,
           COALESCE(likes_count.count, 0) AS "likeCount",
           CASE WHEN user_likes.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS "userLiked"
    FROM blogs b
    LEFT JOIN (
      SELECT blog_id, COUNT(*) AS count
      FROM likes
      GROUP BY blog_id
    ) likes_count ON b.id = likes_count.blog_id
    LEFT JOIN (
      SELECT blog_id, user_id
      FROM likes
      WHERE user_id = $1
    ) user_likes ON b.id = user_likes.blog_id
    ORDER BY b.created_at DESC;
  `;
  const result = await pool.query(query,[userId]);
  return result.rows;
}

export async function getTopLikedBlogs(limit=5,currentUserId=null) {
    const query = `
    SELECT b.id, b.title, b.content, b.created_at, u.name AS author,
           COALESCE(l.like_count, 0) AS "likeCount",
           CASE WHEN ul.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS "userLiked"
    FROM blogs b
    JOIN users u ON b.user_id = u.id
    LEFT JOIN (
      SELECT blog_id, COUNT(*) AS like_count
      FROM likes
      GROUP BY blog_id
    ) l ON b.id = l.blog_id
    LEFT JOIN (
      SELECT blog_id, user_id
      FROM likes
      WHERE user_id = $2
    ) ul ON b.id = ul.blog_id
    ORDER BY "likeCount" DESC, b.created_at DESC
    LIMIT $1;`;
    try{
        const result = await pool.query(query,[limit,currentUserId]);
        return result.rows;
    } catch(error){
        console.error(error);
        throw Error(error);        
    }
}
export async function getUserBlogsWithLikes(userId, currentUserId) {
  const query = `
    SELECT b.*,
           COALESCE(l.like_count, 0) AS "likeCount",
           CASE WHEN ul.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS "userLiked"
    FROM blogs b
    LEFT JOIN (
      SELECT blog_id, COUNT(*) AS like_count
      FROM likes
      GROUP BY blog_id
    ) l ON b.id = l.blog_id
    LEFT JOIN (
      SELECT blog_id, user_id
      FROM likes
      WHERE user_id = $2
    ) ul ON b.id = ul.blog_id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC;
  `;

  const result = await pool.query(query, [userId, currentUserId]);
  return result.rows;
}
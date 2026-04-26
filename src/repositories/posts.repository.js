import { query } from '../db/index.js';

export async function getAllPosts() {
  const result = await query(
    `
      SELECT
        posts.id,
        posts.title,
        posts.user_id,
        users.name AS author_name
      FROM posts
      JOIN users ON users.id = posts.user_id
      ORDER BY posts.id DESC
    `,
  );

  return result.rows;
}

export async function getPostById(id) {
  const result = await query(
    `
      SELECT
        posts.id,
        posts.title,
        posts.user_id,
        users.name AS author_name
      FROM posts
      JOIN users ON users.id = posts.user_id
      WHERE posts.id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
}

export async function createPost({ title, userId }) {
  const result = await query(
    `
      INSERT INTO posts (title, user_id)
      VALUES ($1, $2)
      RETURNING id, title, user_id
    `,
    [title, userId],
  );

  return result.rows[0];
}

export async function updatePostTitle(id, title) {
  const result = await query(
    `
      UPDATE posts
      SET title = $1
      WHERE id = $2
      RETURNING id, title, user_id
    `,
    [title, id],
  );

  return result.rows[0] || null;
}

export async function deletePost(id) {
  const result = await query(
    `
      DELETE FROM posts
      WHERE id = $1
      RETURNING id, title, user_id
    `,
    [id],
  );

  return result.rows[0] || null;
}

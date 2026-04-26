import { query } from '../../src/db/index.js';
import { pool } from '../../src/db/pool.js';
import { runMigrations } from '../../src/db/migrations.js';

export async function prepareTestDatabase() {
  await runMigrations(pool);
}

export async function resetTestDatabase() {
  await query(`
    TRUNCATE TABLE comments, posts, users
    RESTART IDENTITY
    CASCADE
  `);
}

export async function seedBasicGraph() {
  const userResult = await query(
    `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email
    `,
    ['Alice', 'alice@example.com'],
  );

  const user = userResult.rows[0];

  const postResult = await query(
    `
      INSERT INTO posts (title, body, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, body, user_id
    `,
    ['Seeded post', 'Seeded body', user.id],
  );

  const post = postResult.rows[0];

  const commentResult = await query(
    `
      INSERT INTO comments (text, post_id)
      VALUES ($1, $2)
      RETURNING id, text, post_id
    `,
    ['Seeded comment', post.id],
  );

  return {
    user,
    post,
    comment: commentResult.rows[0],
  };
}

export async function closeTestDatabase() {
  await pool.end();
}

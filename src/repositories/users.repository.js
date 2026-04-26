import { query } from '../db/index.js';

export async function getUserById(id) {
  const result = await query(
    `
      SELECT id, name
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
}

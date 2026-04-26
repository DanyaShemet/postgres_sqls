export async function createComment(client, { text, postId }) {
  const result = await client.query(
    `
      INSERT INTO comments (text, post_id)
      VALUES ($1, $2)
      RETURNING id, text, post_id
    `,
    [text, postId],
  );

  return result.rows[0];
}

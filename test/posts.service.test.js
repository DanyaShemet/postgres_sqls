import test from 'node:test';
import assert from 'node:assert/strict';

import { AppError } from '../src/errors/app-error.js';
import { query } from '../src/db/index.js';
import * as postsService from '../src/services/posts.service.js';
import { seedBasicGraph } from './helpers/db-test-helpers.js';

test('posts service creates post with comment in one transaction', async () => {
  const { user } = await seedBasicGraph();

  const result = await postsService.createPostWithComment({
    title: 'Transactional post',
    userId: user.id,
    comment: 'Transactional comment',
  });

  assert.equal(result.post.title, 'Transactional post');
  assert.equal(result.comment.text, 'Transactional comment');

  const comments = await query(
    `
      SELECT text
      FROM comments
      WHERE post_id = $1
    `,
    [result.post.id],
  );

  assert.equal(comments.rows.length, 1);
  assert.equal(comments.rows[0].text, 'Transactional comment');
});

test('posts service rejects createPost for a missing user', async () => {
  await assert.rejects(
    () =>
      postsService.createPost({
        title: 'Should fail',
        userId: 9999,
      }),
    (error) => {
      assert.ok(error instanceof AppError);
      assert.equal(error.statusCode, 400);
      assert.equal(error.message, 'User not found');
      return true;
    },
  );
});

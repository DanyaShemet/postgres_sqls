import test from 'node:test';
import assert from 'node:assert/strict';

import { query } from '../src/db/index.js';
import * as postsRepository from '../src/repositories/posts.repository.js';
import { seedBasicGraph } from './helpers/db-test-helpers.js';

test('posts repository returns a post with author name', async () => {
  const { post, user } = await seedBasicGraph();

  const result = await postsRepository.getPostById(post.id);

  assert.equal(result.id, post.id);
  assert.equal(result.title, post.title);
  assert.equal(result.user_id, user.id);
  assert.equal(result.author_name, user.name);
});

test('posts repository creates and lists posts in descending id order', async () => {
  const firstUser = await query(
    `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name
    `,
    ['First user', 'first@example.com'],
  );

  const secondUser = await query(
    `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name
    `,
    ['Second user', 'second@example.com'],
  );

  const firstPost = await postsRepository.createPost({
    title: 'First post',
    userId: firstUser.rows[0].id,
  });

  const secondPost = await postsRepository.createPost({
    title: 'Second post',
    userId: secondUser.rows[0].id,
  });

  const posts = await postsRepository.getAllPosts();

  assert.equal(posts.length, 2);
  assert.equal(posts[0].id, secondPost.id);
  assert.equal(posts[1].id, firstPost.id);
});

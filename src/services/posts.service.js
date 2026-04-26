import { withTransaction } from '../db/index.js';
import { AppError } from '../errors/app-error.js';
import * as commentsRepository from '../repositories/comments.repository.js';
import * as postsRepository from '../repositories/posts.repository.js';
import * as usersRepository from '../repositories/users.repository.js';

function requireNonEmptyString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(400, `${fieldName} is required`);
  }

  return value.trim();
}

function requirePositiveInteger(value, fieldName) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new AppError(400, `${fieldName} must be a positive integer`);
  }

  return parsedValue;
}

export async function listPosts() {
  return postsRepository.getAllPosts();
}

export async function getPost(id) {
  const postId = requirePositiveInteger(id, 'postId');
  const post = await postsRepository.getPostById(postId);

  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  return post;
}

export async function createPost(payload) {
  const title = requireNonEmptyString(payload.title, 'title');
  const userId = requirePositiveInteger(payload.userId, 'userId');

  const user = await usersRepository.getUserById(userId);

  if (!user) {
    throw new AppError(400, 'User not found');
  }

  return postsRepository.createPost({ title, userId });
}

export async function createPostWithComment(payload) {
  const title = requireNonEmptyString(payload.title, 'title');
  const userId = requirePositiveInteger(payload.userId, 'userId');
  const comment = requireNonEmptyString(payload.comment, 'comment');

  const user = await usersRepository.getUserById(userId);

  if (!user) {
    throw new AppError(400, 'User not found');
  }

  return withTransaction(async (client) => {
    const postResult = await client.query(
      `
        INSERT INTO posts (title, user_id)
        VALUES ($1, $2)
        RETURNING id, title, user_id
      `,
      [title, userId],
    );

    const post = postResult.rows[0];
    const createdComment = await commentsRepository.createComment(client, {
      text: comment,
      postId: post.id,
    });

    return {
      post,
      comment: createdComment,
    };
  });
}

export async function updatePost(id, payload) {
  const postId = requirePositiveInteger(id, 'postId');
  const title = requireNonEmptyString(payload.title, 'title');
  const updatedPost = await postsRepository.updatePostTitle(postId, title);

  if (!updatedPost) {
    throw new AppError(404, 'Post not found');
  }

  return updatedPost;
}

export async function removePost(id) {
  const postId = requirePositiveInteger(id, 'postId');
  const deletedPost = await postsRepository.deletePost(postId);

  if (!deletedPost) {
    throw new AppError(404, 'Post not found');
  }

  return deletedPost;
}

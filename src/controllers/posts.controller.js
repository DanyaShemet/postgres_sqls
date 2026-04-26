import * as postsService from '../services/posts.service.js';

export async function listPosts(req, res) {
  const posts = await postsService.listPosts();
  res.json({ data: posts });
}

export async function getPostById(req, res) {
  const post = await postsService.getPost(req.params.id);
  res.json({ data: post });
}

export async function createPost(req, res) {
  const post = await postsService.createPost(req.body);
  res.status(201).json({ data: post });
}

export async function createPostWithComment(req, res) {
  const result = await postsService.createPostWithComment(req.body);
  res.status(201).json({ data: result });
}

export async function updatePost(req, res) {
  const post = await postsService.updatePost(req.params.id, req.body);
  res.json({ data: post });
}

export async function deletePost(req, res) {
  const post = await postsService.removePost(req.params.id);
  res.json({
    message: 'Post deleted',
    data: post,
  });
}

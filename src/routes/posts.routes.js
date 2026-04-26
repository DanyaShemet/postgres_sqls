import express from 'express';

import * as postsController from '../controllers/posts.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = express.Router();

router.get('/', asyncHandler(postsController.listPosts));
router.get('/:id', asyncHandler(postsController.getPostById));
router.post('/', asyncHandler(postsController.createPost));
router.post('/with-comment', asyncHandler(postsController.createPostWithComment));
router.patch('/:id', asyncHandler(postsController.updatePost));
router.delete('/:id', asyncHandler(postsController.deletePost));

export default router;

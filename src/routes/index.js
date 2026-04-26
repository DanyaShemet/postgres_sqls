import express from 'express';

import healthRoutes from './health.routes.js';
import postsRoutes from './posts.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/posts', postsRoutes);

export default router;

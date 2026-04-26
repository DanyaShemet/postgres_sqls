import express from 'express';

import * as healthController from '../controllers/health.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = express.Router();

router.get('/', asyncHandler(healthController.getHealth));
router.get('/db', asyncHandler(healthController.getDatabaseHealth));

export default router;

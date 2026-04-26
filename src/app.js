import express from 'express';

import routes from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFoundHandler } from './middlewares/not-found.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'API is running',
      docsHint: 'Use /api/posts and /api/health',
    });
  });

  app.use('/api', routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

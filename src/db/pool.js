import pg from 'pg';

import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: env.db.max,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error);
});

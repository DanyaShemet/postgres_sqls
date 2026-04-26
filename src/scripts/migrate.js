import { pool } from '../db/pool.js';
import { runMigrations } from '../db/migrations.js';

async function run() {
  await runMigrations(pool);

  await pool.end();
}

run().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});

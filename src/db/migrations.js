import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

export async function ensureMigrationsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function getAppliedMigrationNames(pool) {
  const result = await pool.query(`
    SELECT filename
    FROM schema_migrations
    ORDER BY filename ASC
  `);

  return new Set(result.rows.map((row) => row.filename));
}

export async function getMigrationFiles() {
  const files = await readdir(migrationsDir);

  return files
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort((left, right) => left.localeCompare(right));
}

export async function runMigrations(pool) {
  await ensureMigrationsTable(pool);

  const appliedMigrations = await getAppliedMigrationNames(pool);
  const migrationFiles = await getMigrationFiles();

  for (const fileName of migrationFiles) {
    if (appliedMigrations.has(fileName)) {
      console.log(`Skipping ${fileName}`);
      continue;
    }

    const fullPath = path.join(migrationsDir, fileName);
    const sql = await readFile(fullPath, 'utf8');
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        `
          INSERT INTO schema_migrations (filename)
          VALUES ($1)
        `,
        [fileName],
      );
      await client.query('COMMIT');
      console.log(`Applied ${fileName}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Failed on ${fileName}`);
      throw error;
    } finally {
      client.release();
    }
  }
}

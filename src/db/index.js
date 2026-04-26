import { env } from '../config/env.js';
import { pool } from './pool.js';

function normalizeSql(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function logQuery(level, payload) {
  if (!env.db.logQueries) {
    return;
  }

  const logger = level === 'error' ? console.error : console.log;
  logger('[db.query]', payload);
}

export async function query(text, params = []) {
  const startedAt = performance.now();

  try {
    const result = await pool.query(text, params);
    const durationMs = Number((performance.now() - startedAt).toFixed(2));

    logQuery('info', {
      durationMs,
      rowCount: result.rowCount,
      sql: normalizeSql(text),
      params,
    });

    return result;
  } catch (error) {
    const durationMs = Number((performance.now() - startedAt).toFixed(2));

    logQuery('error', {
      durationMs,
      sql: normalizeSql(text),
      params,
      error: error.message,
    });

    throw error;
  }
}

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function checkDatabaseHealth() {
  const startedAt = Date.now();
  await query('SELECT 1');

  return {
    status: 'ok',
    responseTimeMs: Date.now() - startedAt,
  };
}

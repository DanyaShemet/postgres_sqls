import { checkDatabaseHealth } from '../db/index.js';

export async function getHealth(req, res) {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
  });
}

export async function getDatabaseHealth(req, res) {
  const dbHealth = await checkDatabaseHealth();
  res.json(dbHealth);
}

import dotenv from 'dotenv';

dotenv.config();

function readNumber(name, fallback) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${name} must be a valid number`);
  }

  return parsedValue;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: readNumber('PORT', 3000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: readNumber('DB_PORT', 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
    max: readNumber('DB_POOL_MAX', 10),
  },
};

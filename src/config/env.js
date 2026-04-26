import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

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

function readBoolean(name, fallback) {
  const rawValue = process.env[name];

  if (rawValue === undefined) {
    return fallback;
  }

  return rawValue === 'true';
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
    logQueries: readBoolean('DB_LOG_QUERIES', process.env.NODE_ENV !== 'production'),
  },
};

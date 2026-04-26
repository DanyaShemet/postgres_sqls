import { after, before, beforeEach } from 'node:test';

process.env.NODE_ENV = 'test';

const {
  closeTestDatabase,
  prepareTestDatabase,
  resetTestDatabase,
} = await import('./helpers/db-test-helpers.js');

before(async () => {
  await prepareTestDatabase();
});

beforeEach(async () => {
  await resetTestDatabase();
});

after(async () => {
  await closeTestDatabase();
});

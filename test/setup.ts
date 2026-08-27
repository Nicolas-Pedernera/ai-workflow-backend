import "dotenv/config";
import { beforeEach, afterAll } from "vitest";
import pg from "pg";

const { Pool } = pg;

process.env.NODE_ENV = "test";

const databaseUrl = process.env.DATABASE_TEST_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_TEST_URL is not configured");
}

const testPool = new Pool({
  connectionString: databaseUrl
});

beforeEach(async () => {
  await testPool.query(
    "TRUNCATE TABLE workflow_runs, workflows RESTART IDENTITY CASCADE"
  );
});

afterAll(async () => {
  await testPool.end();
});

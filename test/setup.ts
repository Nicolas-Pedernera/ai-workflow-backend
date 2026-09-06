import "dotenv/config";
import { beforeEach, afterAll } from "vitest";
import pg from "pg";

const { Pool } = pg;

process.env.NODE_ENV = "test";

// Deterministic Hardhat test account.
// This key is only for local/integration tests and must never be used in production.
process.env.BLOCKCHAIN_PRIVATE_KEY =
  process.env.BLOCKCHAIN_PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


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

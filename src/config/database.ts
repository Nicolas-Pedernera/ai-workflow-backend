import "dotenv/config";

import pg from "pg";

const { Pool } = pg;

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.DATABASE_TEST_URL
    : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    process.env.NODE_ENV === "test"
      ? "DATABASE_TEST_URL is not configured"
      : "DATABASE_URL is not configured"
  );
}

export const db = new Pool({
  connectionString: databaseUrl
});

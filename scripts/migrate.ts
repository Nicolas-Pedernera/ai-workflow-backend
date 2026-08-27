import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({
  connectionString: databaseUrl
});

try {
  const migration = await readFile(
    new URL("../migrations/001_create_workflows.sql", import.meta.url),
    "utf8"
  );

  await pool.query(migration);

  console.log("Database migration completed successfully.");
} finally {
  await pool.end();
}

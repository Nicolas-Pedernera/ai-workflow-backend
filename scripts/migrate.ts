import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
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
  const migrationsDirectory = new URL("../migrations/", import.meta.url);

  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`Running migration: ${file}`);

    const migration = await readFile(
      join(migrationsDirectory.pathname, file),
      "utf8"
    );

    await pool.query(migration);
  }

  console.log("Database migrations completed successfully.");
} finally {
  await pool.end();
}

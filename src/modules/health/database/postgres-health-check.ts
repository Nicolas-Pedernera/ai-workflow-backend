import type { Pool } from "pg";
import type { HealthCheck } from "../domain/health.types.js";
import type { DatabaseHealthPort } from "./database-health.port.js";

export class PostgresHealthCheck implements DatabaseHealthPort {
  constructor(private readonly database: Pool) {}

  async checkDatabase(): Promise<HealthCheck> {
    const startedAt = Date.now();

    try {
      await this.database.query("SELECT 1");

      return { status: "ok", latencyMs: Date.now() - startedAt };
    } catch (error) {
      return {
        status: "error",
        latencyMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : "Database check failed"
      };
    }
  }
}

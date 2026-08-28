import type { Pool } from "pg";
import type { BlockchainService } from "../blockchain/blockchain.service.js";

export interface HealthCheck {
  status: "ok" | "error";
  latencyMs?: number;
  error?: string;
}

export interface ReadinessResult {
  status: "ready" | "not_ready";
  checks: {
    database: HealthCheck;
    blockchain: HealthCheck;
  };
}

export class HealthService {
  constructor(
    private readonly database: Pool,
    private readonly blockchain: BlockchainService
  ) {}

  async checkDatabase(): Promise<HealthCheck> {
    const startedAt = Date.now();

    try {
      await this.database.query("SELECT 1");

      return {
        status: "ok",
        latencyMs: Date.now() - startedAt
      };
    } catch (error) {
      return {
        status: "error",
        latencyMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : "Database check failed"
      };
    }
  }

  async checkBlockchain(): Promise<HealthCheck> {
    const startedAt = Date.now();

    try {
      await this.blockchain.checkConnection();

      return {
        status: "ok",
        latencyMs: Date.now() - startedAt
      };
    } catch (error) {
      return {
        status: "error",
        latencyMs: Date.now() - startedAt,
        error:
          error instanceof Error
            ? error.message
            : "Blockchain check failed"
      };
    }
  }

  async readiness(): Promise<ReadinessResult> {
    const [database, blockchain] = await Promise.all([
      this.checkDatabase(),
      this.checkBlockchain()
    ]);

    const ready =
      database.status === "ok" &&
      blockchain.status === "ok";

    return {
      status: ready ? "ready" : "not_ready",
      checks: {
        database,
        blockchain
      }
    };
  }
}

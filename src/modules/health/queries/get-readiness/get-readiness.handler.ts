import type { BlockchainService } from "../../../blockchain/client/blockchain.service.js";
import type { HealthCheck, ReadinessResult } from "../../domain/health.types.js";
import type { DatabaseHealthPort } from "../../database/database-health.port.js";

export interface GetReadinessDeps {
  database: DatabaseHealthPort;
  blockchain: BlockchainService;
}

async function checkBlockchain(
  blockchain: BlockchainService
): Promise<HealthCheck> {
  const startedAt = Date.now();

  try {
    await blockchain.checkConnection();
    return { status: "ok", latencyMs: Date.now() - startedAt };
  } catch (error) {
    return {
      status: "error",
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Blockchain check failed"
    };
  }
}

export function getReadinessHandler({ database, blockchain }: GetReadinessDeps) {
  return async (): Promise<ReadinessResult> => {
    const [databaseCheck, blockchainCheck] = await Promise.all([
      database.checkDatabase(),
      checkBlockchain(blockchain)
    ]);

    const ready = databaseCheck.status === "ok" && blockchainCheck.status === "ok";

    return {
      status: ready ? "ready" : "not_ready",
      checks: { database: databaseCheck, blockchain: blockchainCheck }
    };
  };
}

import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";
import { BlockchainService } from "../blockchain/client/blockchain.service.js";
import { queryBus } from "../../shared/cqrs/bus.js";
import type { DatabaseHealthPort } from "./database/database-health.port.js";
import { PostgresHealthCheck } from "./database/postgres-health-check.js";
import { getReadinessHandler } from "./queries/get-readiness/get-readiness.handler.js";
import { registerGetReadinessRoute } from "./queries/get-readiness/get-readiness.route.js";

export interface HealthModuleOverrides {
  database?: DatabaseHealthPort;
  blockchain?: BlockchainService;
}

export function registerHealthModule(
  app: FastifyInstance,
  pool: Pool,
  overrides: HealthModuleOverrides = {}
): void {
  const database = overrides.database ?? new PostgresHealthCheck(pool);
  const blockchain = overrides.blockchain ?? new BlockchainService();

  queryBus.register("health.readiness", getReadinessHandler({ database, blockchain }));

  registerGetReadinessRoute(app);
}

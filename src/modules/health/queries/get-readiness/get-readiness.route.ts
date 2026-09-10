import type { FastifyInstance } from "fastify";
import { queryBus } from "../../../../shared/cqrs/bus.js";
import type { ReadinessResult } from "../../domain/health.types.js";

export function registerGetReadinessRoute(app: FastifyInstance): void {
  app.get("/health/ready", async (_request, reply) => {
    const result = await queryBus.execute<ReadinessResult>({
      type: "health.readiness",
      payload: undefined
    });

    return reply.status(result.status === "not_ready" ? 503 : 200).send(result);
  });
}

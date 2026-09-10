import type { FastifyInstance } from "fastify";
import { queryBus } from "../../../../shared/cqrs/bus.js";

export function registerGetBlockchainWorkflowRoute(app: FastifyInstance): void {
  app.get<{ Params: { id: string } }>(
    "/api/v1/workflows/:id/blockchain",
    async (request) => ({
      data: await queryBus.execute({
        type: "workflows.getBlockchain",
        payload: request.params.id
      })
    })
  );
}

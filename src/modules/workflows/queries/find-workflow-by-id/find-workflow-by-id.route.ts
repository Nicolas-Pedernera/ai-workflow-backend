import type { FastifyInstance } from "fastify";
import { queryBus } from "../../../../shared/cqrs/bus.js";

export function registerFindWorkflowByIdRoute(app: FastifyInstance): void {
  app.get<{ Params: { id: string } }>("/api/v1/workflows/:id", async (request) => ({
    data: await queryBus.execute({
      type: "workflows.findById",
      payload: request.params.id
    })
  }));
}

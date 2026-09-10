import type { FastifyInstance } from "fastify";
import { queryBus } from "../../../../shared/cqrs/bus.js";

export function registerFindRunByIdRoute(app: FastifyInstance): void {
  app.get<{ Params: { id: string } }>("/api/v1/runs/:id", async (request) => ({
    data: await queryBus.execute({ type: "runs.findById", payload: request.params.id })
  }));
}

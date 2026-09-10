import type { FastifyInstance } from "fastify";
import { queryBus } from "../../../../shared/cqrs/bus.js";

export function registerFindWorkflowsRoute(app: FastifyInstance): void {
  app.get("/api/v1/workflows", async () => ({
    data: await queryBus.execute({ type: "workflows.findAll", payload: undefined })
  }));
}

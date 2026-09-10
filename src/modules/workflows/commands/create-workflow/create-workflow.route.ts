import type { FastifyInstance } from "fastify";
import { commandBus } from "../../../../shared/cqrs/bus.js";
import { parseCreateWorkflowBody } from "./create-workflow.schema.js";

export function registerCreateWorkflowRoute(app: FastifyInstance): void {
  app.post("/api/v1/workflows", async (request, reply) => {
    const input = parseCreateWorkflowBody(request.body);

    const workflow = await commandBus.execute({
      type: "workflows.create",
      payload: input
    });

    return reply.status(201).send({ data: workflow });
  });
}

import type { FastifyInstance } from "fastify";
import { commandBus } from "../../../../shared/cqrs/bus.js";
import { ValidationException } from "../../../../shared/exceptions/base.exception.js";

export function registerSetWorkflowStatusRoute(app: FastifyInstance): void {
  app.patch<{
    Params: { id: string };
    Body: { status?: unknown };
  }>("/api/v1/workflows/:id/status", async (request, reply) => {
    const body = request.body ?? {};

    if (body.status !== "active" && body.status !== "inactive") {
      throw new ValidationException("status must be either active or inactive");
    }

    const workflow = await commandBus.execute({
      type: "workflows.setStatus",
      payload: { workflowId: request.params.id, status: body.status }
    });

    return reply.send({ data: workflow });
  });
}

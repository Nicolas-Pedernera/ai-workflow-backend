import type { FastifyInstance } from "fastify";
import { commandBus } from "../../../../shared/cqrs/bus.js";
import { ValidationException } from "../../../../shared/exceptions/base.exception.js";

export function registerRunWorkflowRoute(app: FastifyInstance): void {
  app.post<{
    Params: { id: string };
    Body: { input?: Record<string, unknown> };
  }>("/api/v1/workflows/:id/run", async (request, reply) => {
    const body = request.body ?? {};

    if (
      body.input !== undefined &&
      (typeof body.input !== "object" || body.input === null || Array.isArray(body.input))
    ) {
      throw new ValidationException("input must be an object");
    }

    const run = await commandBus.execute({
      type: "workflows.run",
      payload: { workflowId: request.params.id, input: body.input ?? {} }
    });

    return reply.status(201).send({ data: run });
  });
}

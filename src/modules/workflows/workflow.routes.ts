import type { FastifyInstance } from "fastify";
import { WorkflowService } from "./workflow.service.js";

export function registerWorkflowRoutes(
  app: FastifyInstance,
  workflowService: WorkflowService
) {
  app.get("/api/v1/workflows", async () => {
    return {
      data: await workflowService.list()
    };
  });

  app.post("/api/v1/workflows", async (request, reply) => {
    const body = request.body as {
      name?: unknown;
      description?: unknown;
    };

    if (
      typeof body?.name !== "string" ||
      body.name.trim().length === 0
    ) {
      return reply.status(400).send({
        status: "error",
        error: "Validation Error",
        message: "name is required and must be a non-empty string"
      });
    }

    if (
      body.description !== undefined &&
      typeof body.description !== "string"
    ) {
      return reply.status(400).send({
        status: "error",
        error: "Validation Error",
        message: "description must be a string"
      });
    }

    const workflow = await workflowService.create({
      name: body.name.trim(),
      description: body.description
    });

    return reply.status(201).send({
      data: workflow
    });
  });

  app.get<{
    Params: { id: string };
  }>("/api/v1/workflows/:id", async (request, reply) => {
    const workflow = await workflowService.getById(request.params.id);

    if (!workflow) {
      return reply.status(404).send({
        status: "error",
        error: "Not Found",
        message: "Workflow not found"
      });
    }

    return {
      data: workflow
    };
  });

  app.get<{
    Params: { id: string };
  }>("/api/v1/workflows/:id/blockchain", async (request, reply) => {
    const workflow = await workflowService.getBlockchainWorkflow(
      request.params.id
    );

    if (!workflow) {
      return reply.status(404).send({
        status: "error",
        error: "Not Found",
        message: "Workflow not found"
      });
    }

    return {
      data: workflow
    };
  });

  app.post<{
    Params: { id: string };
    Body: { input?: Record<string, unknown> };
  }>("/api/v1/workflows/:id/run", async (request, reply) => {
    const body = request.body ?? {};

    if (
      body.input !== undefined &&
      (
        typeof body.input !== "object" ||
        body.input === null ||
        Array.isArray(body.input)
      )
    ) {
      return reply.status(400).send({
        status: "error",
        error: "Validation Error",
        message: "input must be an object"
      });
    }

    const run = await workflowService.run(
      request.params.id,
      body.input ?? {}
    );

    if (!run) {
      return reply.status(404).send({
        status: "error",
        error: "Not Found",
        message: "Workflow not found"
      });
    }

    return reply.status(201).send({
      data: run
    });
  });

  app.get<{
    Params: { id: string };
  }>("/api/v1/runs/:id", async (request, reply) => {
    const run = await workflowService.getRunById(request.params.id);

    if (!run) {
      return reply.status(404).send({
        status: "error",
        error: "Not Found",
        message: "Workflow run not found"
      });
    }

    return {
      data: run
    };
  });
}

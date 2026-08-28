import Fastify from "fastify";
import { registerWorkflowRoutes } from "./modules/workflows/workflow.routes.js";
import { WorkflowService } from "./modules/workflows/workflow.service.js";

export function buildApp(workflowService = new WorkflowService()) {
  const app = Fastify({
    logger: true
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "ai-workflow-backend"
    };
  });

  app.get("/api/v1/status", async () => {
    return {
      status: "ok",
      service: "ai-workflow-backend",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    };
  });

  registerWorkflowRoutes(app, workflowService);

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      status: "error",
      error: "Not Found",
      message: `Route ${request.method} ${request.url} not found`
    });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    const statusCode =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    const errorName =
      error instanceof Error ? error.name : "Internal Server Error";

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    reply.status(statusCode).send({
      status: "error",
      error: errorName,
      message
    });
  });

  return app;
}

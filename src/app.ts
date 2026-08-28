import Fastify from "fastify";
import { registerWorkflowRoutes } from "./modules/workflows/workflow.routes.js";
import { WorkflowService } from "./modules/workflows/workflow.service.js";
import { HealthService } from "./modules/health/health.service.js";
import { db } from "./config/database.js";
import { BlockchainService } from "./modules/blockchain/blockchain.service.js";

export function buildApp(
  workflowService?: WorkflowService,
  healthService?: HealthService
) {
  const resolvedWorkflowService = workflowService ?? new WorkflowService();
  const resolvedHealthService =
    healthService ?? new HealthService(db, new BlockchainService());
  const app = Fastify({
    logger: true
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "ai-workflow-backend"
    };
  });

  app.get("/health/ready", async (_request, reply) => {
    const result = await resolvedHealthService.readiness();

    if (result.status === "not_ready") {
      return reply.status(503).send(result);
    }

    return reply.status(200).send(result);
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

  registerWorkflowRoutes(app, resolvedWorkflowService);

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

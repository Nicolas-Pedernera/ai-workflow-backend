import Fastify from "fastify";
import {
  registerWorkflowsModule,
  type WorkflowsModuleOverrides
} from "./modules/workflows/index.js";
import {
  registerHealthModule,
  type HealthModuleOverrides
} from "./modules/health/index.js";
import { db } from "./config/database.js";
import { registerErrorHandler } from "./shared/error-handler.js";

export function buildApp(
  healthOverrides?: HealthModuleOverrides,
  workflowsOverrides?: WorkflowsModuleOverrides
) {
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

  registerHealthModule(app, db, healthOverrides);
  registerWorkflowsModule(app, workflowsOverrides);

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      status: "error",
      error: "Not Found",
      message: `Route ${request.method} ${request.url} not found`
    });
  });

  registerErrorHandler(app);

  return app;
}

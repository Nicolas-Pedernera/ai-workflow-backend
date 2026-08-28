import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import type { HealthService } from "../src/modules/health/health.service.js";

function createHealthService(
  databaseStatus: "ok" | "error",
  blockchainStatus: "ok" | "error"
) {
  return {
    readiness: async () => ({
      status:
        databaseStatus === "ok" && blockchainStatus === "ok"
          ? "ready"
          : "not_ready",
      checks: {
        database: {
          status: databaseStatus,
          latencyMs: 1,
          ...(databaseStatus === "error"
            ? { error: "Database unavailable" }
            : {})
        },
        blockchain: {
          status: blockchainStatus,
          latencyMs: 2,
          ...(blockchainStatus === "error"
            ? { error: "Blockchain unavailable" }
            : {})
        }
      }
    })
  } as unknown as HealthService;
}

describe("API", () => {
  it("returns a healthy service status", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ok",
      service: "ai-workflow-backend"
    });

    await app.close();
  });

  it("returns ready when database and blockchain are healthy", async () => {
    const healthService = createHealthService("ok", "ok");
    const app = buildApp(undefined, healthService);

    const response = await app.inject({
      method: "GET",
      url: "/health/ready"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: "ready",
      checks: {
        database: {
          status: "ok",
          latencyMs: 1
        },
        blockchain: {
          status: "ok",
          latencyMs: 2
        }
      }
    });

    await app.close();
  });

  it("returns 503 when database is unavailable", async () => {
    const healthService = createHealthService("error", "ok");
    const app = buildApp(undefined, healthService);

    const response = await app.inject({
      method: "GET",
      url: "/health/ready"
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      status: "not_ready",
      checks: {
        database: {
          status: "error",
          error: "Database unavailable"
        },
        blockchain: {
          status: "ok"
        }
      }
    });

    await app.close();
  });

  it("returns 503 when blockchain is unavailable", async () => {
    const healthService = createHealthService("ok", "error");
    const app = buildApp(undefined, healthService);

    const response = await app.inject({
      method: "GET",
      url: "/health/ready"
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      status: "not_ready",
      checks: {
        database: {
          status: "ok"
        },
        blockchain: {
          status: "error",
          error: "Blockchain unavailable"
        }
      }
    });

    await app.close();
  });

  it("returns 503 when database and blockchain are unavailable", async () => {
    const healthService = createHealthService("error", "error");
    const app = buildApp(undefined, healthService);

    const response = await app.inject({
      method: "GET",
      url: "/health/ready"
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      status: "not_ready",
      checks: {
        database: {
          status: "error"
        },
        blockchain: {
          status: "error"
        }
      }
    });

    await app.close();
  });

  it("returns API status information", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/status"
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toMatchObject({
      status: "ok",
      service: "ai-workflow-backend",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development"
    });

    await app.close();
  });

  it("returns a structured 404 response for unknown routes", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/does-not-exist"
    });

    expect(response.statusCode).toBe(404);

    expect(response.json()).toMatchObject({
      status: "error",
      error: "Not Found",
      message: "Route GET /does-not-exist not found"
    });

    await app.close();
  });
});

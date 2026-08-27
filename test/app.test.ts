import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

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

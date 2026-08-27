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
    expect(response.json()).toEqual({
      status: "ok",
      service: "ai-workflow-backend"
    });

    await app.close();
  });
});

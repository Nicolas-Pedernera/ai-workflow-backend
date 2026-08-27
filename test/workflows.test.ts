import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

describe("Workflows API", () => {
  it("creates and retrieves a workflow", async () => {
    const app = buildApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {
        name: "Summarize document",
        description: "Summarizes a document using an AI provider"
      }
    });

    expect(createResponse.statusCode).toBe(201);

    const workflow = createResponse.json().data;

    expect(workflow.name).toBe("Summarize document");
    expect(workflow.status).toBe("active");

    const getResponse = await app.inject({
      method: "GET",
      url: `/api/v1/workflows/${workflow.id}`
    });

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.json().data.id).toBe(workflow.id);

    await app.close();
  });

  it("lists workflows", async () => {
    const app = buildApp();

    await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {
        name: "Workflow one"
      }
    });

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/workflows"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);

    await app.close();
  });

  it("runs a workflow and retrieves the run", async () => {
    const app = buildApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {
        name: "AI assistant"
      }
    });

    const workflowId = createResponse.json().data.id;

    const runResponse = await app.inject({
      method: "POST",
      url: `/api/v1/workflows/${workflowId}/run`,
      payload: {
        input: {
          prompt: "Hello AI"
        }
      }
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json().data;

    expect(run.status).toBe("completed");
    expect(run.input).toEqual({
      prompt: "Hello AI"
    });

    const getRunResponse = await app.inject({
      method: "GET",
      url: `/api/v1/runs/${run.id}`
    });

    expect(getRunResponse.statusCode).toBe(200);
    expect(getRunResponse.json().data.id).toBe(run.id);

    await app.close();
  });

  it("returns 404 when a workflow does not exist", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/workflows/unknown"
    });

    expect(response.statusCode).toBe(404);

    await app.close();
  });

  it("validates workflow creation input", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {}
    });

    expect(response.statusCode).toBe(400);

    await app.close();
  });
});

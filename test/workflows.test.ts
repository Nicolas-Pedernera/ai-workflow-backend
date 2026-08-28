import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import { WorkflowService } from "../src/modules/workflows/workflow.service.js";
import { BlockchainService } from "../src/modules/blockchain/blockchain.service.js";

describe("Workflows API", () => {
  function buildTestApp() {
    const blockchain = {
      registerWorkflow: async (workflowId: string) => ({
        blockchainId: `0x${workflowId.replace(/[^a-f0-9]/gi, "").padEnd(64, "0").slice(0, 64)}`,
        transactionHash: `0x${"a".repeat(64)}`
      })
    };

    const workflowService = new WorkflowService(
      undefined,
      undefined,
      blockchain as unknown as BlockchainService
    );

    return buildApp(workflowService);
  }
  it("creates and retrieves a workflow", async () => {
    const app = buildTestApp();

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
    const app = buildTestApp();

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

  it("runs a workflow successfully", async () => {
    const app = buildTestApp();

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
    expect(run.startedAt).not.toBeNull();
    expect(run.completedAt).not.toBeNull();
    expect(run.error).toBeNull();

    expect(run.output).toEqual({
      message: "Mock response for: Hello AI",
      workflowId,
      processedInput: {
        prompt: "Hello AI"
      }
    });

    const getRunResponse = await app.inject({
      method: "GET",
      url: `/api/v1/runs/${run.id}`
    });

    expect(getRunResponse.statusCode).toBe(200);
    expect(getRunResponse.json().data.id).toBe(run.id);

    await app.close();
  });

  it("handles a failed workflow execution", async () => {
    const app = buildTestApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {
        name: "Failing workflow"
      }
    });

    const workflowId = createResponse.json().data.id;

    const runResponse = await app.inject({
      method: "POST",
      url: `/api/v1/workflows/${workflowId}/run`,
      payload: {
        input: {
          fail: true
        }
      }
    });

    expect(runResponse.statusCode).toBe(201);

    const run = runResponse.json().data;

    expect(run.status).toBe("failed");
    expect(run.output).toBeNull();
    expect(run.error).toBe("Workflow execution failed");
    expect(run.startedAt).not.toBeNull();
    expect(run.completedAt).not.toBeNull();

    await app.close();
  });

  it("changes workflow status to inactive and updates blockchain", async () => {
    const blockchain = {
      registerWorkflow: async (workflowId: string) => ({
        blockchainId: `0x${workflowId.replace(/[^a-f0-9]/gi, "").padEnd(64, "0").slice(0, 64)}`,
        transactionHash: `0x${"a".repeat(64)}`
      }),
      setWorkflowStatus: async (_workflowId: string, _active: boolean) =>
        `0x${"b".repeat(64)}`
    };

    const workflowService = new WorkflowService(
      undefined,
      undefined,
      blockchain as unknown as BlockchainService
    );

    const app = buildApp(workflowService);

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {
        name: "Status lifecycle test"
      }
    });

    const workflowId = createResponse.json().data.id;

    const response = await app.inject({
      method: "PATCH",
      url: `/api/v1/workflows/${workflowId}/status`,
      payload: {
        status: "inactive"
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.status).toBe("inactive");

    await app.close();
  });

  it("rejects an invalid workflow status", async () => {
    const app = buildTestApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {
        name: "Invalid status test"
      }
    });

    const workflowId = createResponse.json().data.id;

    const response = await app.inject({
      method: "PATCH",
      url: `/api/v1/workflows/${workflowId}/status`,
      payload: {
        status: "paused"
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      status: "error",
      error: "Validation Error"
    });

    await app.close();
  });

  it("returns 404 when a workflow does not exist", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/workflows/unknown"
    });

    expect(response.statusCode).toBe(404);

    await app.close();
  });

  it("returns 404 when running an unknown workflow", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/workflows/unknown/run"
    });

    expect(response.statusCode).toBe(404);

    await app.close();
  });

  it("validates workflow creation input", async () => {
    const app = buildTestApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {}
    });

    expect(response.statusCode).toBe(400);

    await app.close();
  });
});

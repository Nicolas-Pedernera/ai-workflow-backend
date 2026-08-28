import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

describe("Blockchain integration", () => {
  it("registers a workflow on-chain and retrieves its blockchain state", async () => {
    const app = buildApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/v1/workflows",
      payload: {
        name: "Blockchain integration test",
        description: "Verifies API to smart contract integration"
      }
    });

    expect(createResponse.statusCode).toBe(201);

    const workflow = createResponse.json().data;

    expect(workflow.id).toMatch(/^wf_/);
    expect(workflow.blockchainId).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(workflow.blockchainTransactionHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

    const blockchainResponse = await app.inject({
      method: "GET",
      url: `/api/v1/workflows/${workflow.id}/blockchain`
    });

    expect(blockchainResponse.statusCode).toBe(200);

    const blockchainWorkflow = blockchainResponse.json().data;

    expect(blockchainWorkflow.workflowId).toBe(workflow.blockchainId);
    expect(blockchainWorkflow.owner).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(blockchainWorkflow.active).toBe(true);
    expect(blockchainWorkflow.createdAt).toMatch(/^\d+$/);

    await app.close();
  });
});

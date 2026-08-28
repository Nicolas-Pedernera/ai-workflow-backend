import { describe, expect, it, vi } from "vitest";
import { WorkflowService } from "../src/modules/workflows/workflow.service.js";

describe("WorkflowService blockchain integration", () => {
  it("registers a workflow on-chain and persists blockchain data", async () => {
    const repository = {
      saveWorkflow: vi.fn(async (workflow) => workflow)
    };

    const aiProvider = {
      generate: vi.fn()
    };

    const blockchain = {
      registerWorkflow: vi.fn(async () => ({
        blockchainId:
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        transactionHash:
          "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
      }))
    };

    const service = new WorkflowService(
      repository as any,
      aiProvider as any,
      blockchain as any
    );

    const workflow = await service.create({
      name: "Blockchain test",
      description: "Verifies blockchain registration"
    });

    expect(blockchain.registerWorkflow).toHaveBeenCalledTimes(1);
    expect(blockchain.registerWorkflow).toHaveBeenCalledWith(workflow.id);

    expect(repository.saveWorkflow).toHaveBeenCalledTimes(1);
    expect(repository.saveWorkflow).toHaveBeenCalledWith(workflow);

    expect(workflow.blockchainId).toBe(
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    );

    expect(workflow.blockchainTransactionHash).toBe(
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    );
  });
});

  it("does not persist the workflow when blockchain registration fails", async () => {
    const repository = {
      saveWorkflow: vi.fn(async (workflow) => workflow)
    };

    const aiProvider = {
      generate: vi.fn()
    };

    const blockchain = {
      registerWorkflow: vi.fn(async () => {
        throw new Error("Blockchain registration failed");
      })
    };

    const service = new WorkflowService(
      repository as any,
      aiProvider as any,
      blockchain as any
    );

    await expect(
      service.create({
        name: "Blockchain failure test"
      })
    ).rejects.toThrow("Blockchain registration failed");

    expect(blockchain.registerWorkflow).toHaveBeenCalledTimes(1);
    expect(repository.saveWorkflow).not.toHaveBeenCalled();
  });

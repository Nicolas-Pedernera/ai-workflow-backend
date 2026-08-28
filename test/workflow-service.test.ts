import { describe, expect, it, vi } from "vitest";
import { WorkflowService } from "../src/modules/workflows/workflow.service.js";
import type { Workflow } from "../src/modules/workflows/workflow.types.js";
import type { AIProvider } from "../src/providers/ai/ai-provider.js";
import { WorkflowRepository } from "../src/modules/workflows/workflow.repository.js";
import { BlockchainService } from "../src/modules/blockchain/blockchain.service.js";

describe("WorkflowService blockchain integration", () => {
  it("registers a workflow on-chain and persists blockchain data", async () => {
    const repository = {
      saveWorkflow: vi.fn(async (workflow: Workflow) => workflow)
    } as unknown as WorkflowRepository;

    const aiProvider = {
      generate: vi.fn()
    } as unknown as AIProvider;

    const blockchain = {
      registerWorkflow: vi.fn(async () => ({
        blockchainId:
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        transactionHash:
          "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
      }))
    } as unknown as BlockchainService;

    const service = new WorkflowService(
      repository,
      aiProvider,
      blockchain
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

  it("does not persist the workflow when blockchain registration fails", async () => {
    const repository = {
      saveWorkflow: vi.fn(async (workflow: Workflow) => workflow)
    } as unknown as WorkflowRepository;

    const aiProvider = {
      generate: vi.fn()
    } as unknown as AIProvider;

    const blockchain = {
      registerWorkflow: vi.fn(async () => {
        throw new Error("Blockchain registration failed");
      })
    } as unknown as BlockchainService;

    const service = new WorkflowService(
      repository,
      aiProvider,
      blockchain
    );

    await expect(
      service.create({
        name: "Blockchain failure test"
      })
    ).rejects.toThrow("Blockchain registration failed");

    expect(blockchain.registerWorkflow).toHaveBeenCalledTimes(1);
    expect(repository.saveWorkflow).not.toHaveBeenCalled();
  });
});

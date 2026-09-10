import { describe, expect, it, vi } from "vitest";
import { createWorkflowHandler } from "../src/modules/workflows/commands/create-workflow/create-workflow.handler.js";
import type { Workflow } from "../src/modules/workflows/domain/workflow.types.js";
import type { BlockchainService } from "../src/modules/blockchain/client/blockchain.service.js";
import type { WorkflowRepositoryPort } from "../src/modules/workflows/database/workflow.repository.port.js";

describe("createWorkflowHandler — blockchain integration", () => {
  it("registers a workflow on-chain and persists blockchain data", async () => {
    const repository = {
      saveWorkflow: vi.fn(async (workflow: Workflow) => workflow)
    } as unknown as WorkflowRepositoryPort;

    const blockchain = {
      registerWorkflow: vi.fn(async () => ({
        blockchainId:
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        transactionHash:
          "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
      }))
    } as unknown as BlockchainService;

    const handler = createWorkflowHandler({ repository, blockchain });

    const workflow = await handler({
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
    } as unknown as WorkflowRepositoryPort;

    const blockchain = {
      registerWorkflow: vi.fn(async () => {
        throw new Error("Blockchain registration failed");
      })
    } as unknown as BlockchainService;

    const handler = createWorkflowHandler({ repository, blockchain });

    await expect(
      handler({ name: "Blockchain failure test" })
    ).rejects.toThrow("Blockchain registration failed");

    expect(blockchain.registerWorkflow).toHaveBeenCalledTimes(1);
    expect(repository.saveWorkflow).not.toHaveBeenCalled();
  });
});

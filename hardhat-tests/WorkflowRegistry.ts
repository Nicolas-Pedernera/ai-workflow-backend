import { describe, it } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";
import { keccak256, stringToHex } from "viem";

describe("WorkflowRegistry", () => {
  async function deployRegistry() {
    const connection = await hre.network.create();

    const [owner, other] =
      await connection.viem.getWalletClients();

    const publicClient =
      await connection.viem.getPublicClient();

    const registry =
      await connection.viem.deployContract(
        "WorkflowRegistry"
      );

    return {
      connection,
      owner,
      other,
      publicClient,
      registry
    };
  }

  function workflowId(value: string) {
    return keccak256(stringToHex(value));
  }

  it("registers a workflow", async () => {
    const {
      owner,
      publicClient,
      registry
    } = await deployRegistry();

    const id = workflowId("workflow-1");

    await registry.write.registerWorkflow(
      [id],
      {
        account: owner.account
      }
    );

    const workflow =
      await publicClient.readContract({
        address: registry.address,
        abi: registry.abi,
        functionName: "getWorkflow",
        args: [id]
      });

    assert.equal(workflow.workflowId, id);
    assert.equal(
      workflow.owner.toLowerCase(),
      owner.account.address.toLowerCase()
    );
    assert.equal(workflow.active, true);
  });

  it("rejects duplicate workflow registration", async () => {
    const {
      owner,
      registry
    } = await deployRegistry();

    const id = workflowId("workflow-1");

    await registry.write.registerWorkflow(
      [id],
      {
        account: owner.account
      }
    );

    await assert.rejects(
      registry.write.registerWorkflow(
        [id],
        {
          account: owner.account
        }
      ),
      /Workflow already exists/
    );
  });

  it("allows only the owner to change workflow status", async () => {
    const {
      owner,
      other,
      publicClient,
      registry
    } = await deployRegistry();

    const id = workflowId("workflow-1");

    await registry.write.registerWorkflow(
      [id],
      {
        account: owner.account
      }
    );

    const otherRegistry =
      registry.write
        ? registry
        : registry;

    await assert.rejects(
      otherRegistry.write.setWorkflowStatus(
        [id, false],
        {
          account: other.account
        }
      ),
      /Not workflow owner/
    );

    await registry.write.setWorkflowStatus(
      [id, false],
      {
        account: owner.account
      }
    );

    const workflow =
      await publicClient.readContract({
        address: registry.address,
        abi: registry.abi,
        functionName: "getWorkflow",
        args: [id]
      });

    assert.equal(workflow.active, false);
  });

  it("rejects an empty workflow ID", async () => {
    const {
      owner,
      registry
    } = await deployRegistry();

    const emptyId =
      "0x0000000000000000000000000000000000000000000000000000000000000000";

    await assert.rejects(
      registry.write.registerWorkflow(
        [emptyId],
        {
          account: owner.account
        }
      ),
      /Invalid workflow ID/
    );
  });

  it("rejects reading an unknown workflow", async () => {
    const {
      publicClient,
      registry
    } = await deployRegistry();

    const id = workflowId("unknown");

    await assert.rejects(
      publicClient.readContract({
        address: registry.address,
        abi: registry.abi,
        functionName: "getWorkflow",
        args: [id]
      }),
      /Workflow not found/
    );
  });
});

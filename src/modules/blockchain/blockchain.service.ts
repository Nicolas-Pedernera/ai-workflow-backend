import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  toHex
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { blockchainConfig } from "../../config/blockchain.js";
import { workflowRegistryAbi } from "./workflow-registry.abi.js";
import { BlockchainWorkflowNotFoundError } from "./blockchain.errors.js";

export class BlockchainService {
  private readonly account;
  private readonly publicClient;
  private readonly walletClient;
  private readonly contractAddress;

  constructor() {
    this.account = blockchainConfig.privateKey
      ? privateKeyToAccount(blockchainConfig.privateKey)
      : undefined;

    this.publicClient = createPublicClient({
      chain: hardhat,
      transport: http(blockchainConfig.rpcUrl)
    });

    this.walletClient = this.account
      ? createWalletClient({
          account: this.account,
          chain: hardhat,
          transport: http(blockchainConfig.rpcUrl)
        })
      : undefined;

    this.contractAddress = blockchainConfig.contractAddress;
  }

  private requireWalletClient() {
    if (!this.walletClient) {
      throw new Error(
        "BLOCKCHAIN_PRIVATE_KEY is required for blockchain write operations"
      );
    }

    return this.walletClient;
  }

  workflowIdToBytes32(workflowId: string): `0x${string}` {
    return keccak256(toHex(workflowId));
  }

  async checkConnection(): Promise<void> {
    await this.publicClient.getBlockNumber();
  }

  async registerWorkflow(workflowId: string) {
    const blockchainId = this.workflowIdToBytes32(workflowId);

    const walletClient = this.requireWalletClient();

    const hash = await walletClient.writeContract({
      address: this.contractAddress,
      abi: workflowRegistryAbi,
      functionName: "registerWorkflow",
      args: [blockchainId]
    });

    return {
      blockchainId,
      transactionHash: hash
    };
  }

  async setWorkflowStatus(
    workflowId: string,
    active: boolean
  ): Promise<string> {
    const blockchainId = this.workflowIdToBytes32(workflowId);

    const walletClient = this.requireWalletClient();

    return await walletClient.writeContract({
      address: this.contractAddress,
      abi: workflowRegistryAbi,
      functionName: "setWorkflowStatus",
      args: [blockchainId, active]
    });
  }

  async getWorkflow(workflowId: string) {
    const blockchainId = this.workflowIdToBytes32(workflowId);

    try {
      const workflow = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: workflowRegistryAbi,
        functionName: "getWorkflow",
        args: [blockchainId]
      });

      return {
        workflowId: workflow.workflowId,
        owner: workflow.owner,
        active: workflow.active,
        createdAt: workflow.createdAt.toString()
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Workflow not found")
      ) {
        throw new BlockchainWorkflowNotFoundError(workflowId);
      }

      throw error;
    }
  }
}

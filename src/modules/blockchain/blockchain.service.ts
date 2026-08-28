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

export class BlockchainService {
  private readonly account;
  private readonly publicClient;
  private readonly walletClient;
  private readonly contractAddress;

  constructor() {
    this.account = privateKeyToAccount(blockchainConfig.privateKey);

    this.publicClient = createPublicClient({
      chain: hardhat,
      transport: http(blockchainConfig.rpcUrl)
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: hardhat,
      transport: http(blockchainConfig.rpcUrl)
    });

    this.contractAddress = blockchainConfig.contractAddress;
  }

  workflowIdToBytes32(workflowId: string): `0x${string}` {
    return keccak256(toHex(workflowId));
  }

  async registerWorkflow(workflowId: string) {
    const blockchainId = this.workflowIdToBytes32(workflowId);

    const hash = await this.walletClient.writeContract({
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

  async getWorkflow(workflowId: string) {
    const blockchainId = this.workflowIdToBytes32(workflowId);

    return await this.publicClient.readContract({
      address: this.contractAddress,
      abi: workflowRegistryAbi,
      functionName: "getWorkflow",
      args: [blockchainId]
    });
  }
}

import "dotenv/config";

const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
const contractAddress = process.env.WORKFLOW_REGISTRY_ADDRESS;

if (!rpcUrl) {
  throw new Error("BLOCKCHAIN_RPC_URL is not configured");
}

if (!privateKey) {
  throw new Error("BLOCKCHAIN_PRIVATE_KEY is not configured");
}

if (!contractAddress) {
  throw new Error("WORKFLOW_REGISTRY_ADDRESS is not configured");
}

export const blockchainConfig = {
  rpcUrl,
  privateKey: privateKey as `0x${string}`,
  contractAddress: contractAddress as `0x${string}`
};

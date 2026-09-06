import "dotenv/config";

const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
const contractAddress = process.env.WORKFLOW_REGISTRY_ADDRESS;
const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;

if (!rpcUrl) {
  throw new Error("BLOCKCHAIN_RPC_URL is not configured");
}

if (!contractAddress) {
  throw new Error("WORKFLOW_REGISTRY_ADDRESS is not configured");
}

export const blockchainConfig = {
  rpcUrl,
  contractAddress: contractAddress as `0x${string}`,
  privateKey: privateKey
    ? (privateKey as `0x${string}`)
    : undefined
};

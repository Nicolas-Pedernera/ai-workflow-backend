import { BlockchainService } from "../src/modules/blockchain/blockchain.service.js";

const blockchain = new BlockchainService();

const workflowId = "wf_test_blockchain_001";

console.log("Registering workflow:", workflowId);

const registration = await blockchain.registerWorkflow(workflowId);

console.log("Blockchain ID:", registration.blockchainId);
console.log("Transaction:", registration.transactionHash);

const workflow = await blockchain.getWorkflow(workflowId);

console.log("On-chain workflow:", workflow);

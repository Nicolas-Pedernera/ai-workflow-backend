import type { BlockchainService } from "../../../blockchain/client/blockchain.service.js";
import type { WorkflowRepositoryPort } from "../../database/workflow.repository.port.js";
import { createWorkflowEntity } from "../../domain/workflow.domain.js";
import type { CreateWorkflowInput, Workflow } from "../../domain/workflow.types.js";

export interface CreateWorkflowDeps {
  repository: WorkflowRepositoryPort;
  blockchain: BlockchainService;
}

export function createWorkflowHandler({ repository, blockchain }: CreateWorkflowDeps) {
  return async (input: CreateWorkflowInput): Promise<Workflow> => {
    const workflow = createWorkflowEntity(input);

    const registration = await blockchain.registerWorkflow(workflow.id);
    workflow.blockchainId = registration.blockchainId;
    workflow.blockchainTransactionHash = registration.transactionHash;

    return repository.saveWorkflow(workflow);
  };
}

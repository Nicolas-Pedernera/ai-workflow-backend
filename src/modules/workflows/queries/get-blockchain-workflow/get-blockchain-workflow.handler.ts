import type { BlockchainService } from "../../../blockchain/client/blockchain.service.js";
import type { WorkflowRepositoryPort } from "../../database/workflow.repository.port.js";
import { WorkflowNotFoundError } from "../../domain/workflow.errors.js";

export interface GetBlockchainWorkflowDeps {
  repository: WorkflowRepositoryPort;
  blockchain: BlockchainService;
}

export function getBlockchainWorkflowHandler({
  repository,
  blockchain
}: GetBlockchainWorkflowDeps) {
  return async (id: string) => {
    const workflow = await repository.findWorkflowById(id);
    if (!workflow) throw new WorkflowNotFoundError(id);

    const blockchainWorkflow = await blockchain.getWorkflow(id);
    if (!blockchainWorkflow) throw new WorkflowNotFoundError(id);

    return blockchainWorkflow;
  };
}

import type { BlockchainService } from "../../../blockchain/client/blockchain.service.js";
import type { WorkflowRepositoryPort } from "../../database/workflow.repository.port.js";
import { applyWorkflowStatus } from "../../domain/workflow.domain.js";
import { WorkflowNotFoundError } from "../../domain/workflow.errors.js";
import type { Workflow, WorkflowStatus } from "../../domain/workflow.types.js";

export interface SetWorkflowStatusPayload {
  workflowId: string;
  status: WorkflowStatus;
}

export interface SetWorkflowStatusDeps {
  repository: WorkflowRepositoryPort;
  blockchain: BlockchainService;
}

export function setWorkflowStatusHandler({
  repository,
  blockchain
}: SetWorkflowStatusDeps) {
  return async ({
    workflowId,
    status
  }: SetWorkflowStatusPayload): Promise<Workflow> => {
    const workflow = await repository.findWorkflowById(workflowId);

    if (!workflow) {
      throw new WorkflowNotFoundError(workflowId);
    }

    await blockchain.setWorkflowStatus(workflowId, status === "active");

    return repository.saveWorkflow(applyWorkflowStatus(workflow, status));
  };
}

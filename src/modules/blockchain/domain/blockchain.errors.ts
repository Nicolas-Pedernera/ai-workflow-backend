import { NotFoundException } from "../../../shared/exceptions/base.exception.js";

export class BlockchainWorkflowNotFoundError extends NotFoundException {
  constructor(workflowId: string) {
    super(`Workflow ${workflowId} not found on blockchain`);
  }
}

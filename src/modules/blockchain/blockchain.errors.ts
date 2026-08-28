export class BlockchainWorkflowNotFoundError extends Error {
  readonly statusCode = 404;

  constructor(workflowId: string) {
    super(`Workflow ${workflowId} not found on blockchain`);
    this.name = "BlockchainWorkflowNotFoundError";
  }
}

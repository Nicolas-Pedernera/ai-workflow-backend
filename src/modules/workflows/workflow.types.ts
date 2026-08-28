export type WorkflowStatus = "active" | "inactive";

export type WorkflowRunStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
  blockchainId: string | null;
  blockchainTransactionHash: string | null;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: WorkflowRunStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface CreateWorkflowInput {
  name: string;
  description?: string;
}

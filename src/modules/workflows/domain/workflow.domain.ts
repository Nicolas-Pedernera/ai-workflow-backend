import crypto from "node:crypto";
import { InvalidWorkflowNameError } from "./workflow.errors.js";
import type {
  CreateWorkflowInput,
  Workflow,
  WorkflowRun,
  WorkflowStatus
} from "./workflow.types.js";

/**
 * Crea la entidad Workflow a partir del input validado.
 * No conoce blockchain ni base de datos: eso lo orquesta el handler.
 */
export function createWorkflowEntity(input: CreateWorkflowInput): Workflow {
  if (!input.name || input.name.trim().length === 0) {
    throw new InvalidWorkflowNameError();
  }

  const now = new Date().toISOString();

  return {
    id: `wf_${crypto.randomUUID()}`,
    name: input.name.trim(),
    description: input.description ?? "",
    status: "active",
    createdAt: now,
    updatedAt: now,
    blockchainId: null,
    blockchainTransactionHash: null
  };
}

export function applyWorkflowStatus(
  workflow: Workflow,
  status: WorkflowStatus
): Workflow {
  return {
    ...workflow,
    status,
    updatedAt: new Date().toISOString()
  };
}

export function createPendingRun(
  workflowId: string,
  input: Record<string, unknown>
): WorkflowRun {
  return {
    id: `run_${crypto.randomUUID()}`,
    workflowId,
    status: "pending",
    input,
    output: null,
    error: null,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null
  };
}

export function startRun(run: WorkflowRun): WorkflowRun {
  return { ...run, status: "running", startedAt: new Date().toISOString() };
}

export function completeRun(
  run: WorkflowRun,
  output: Record<string, unknown>
): WorkflowRun {
  return {
    ...run,
    status: "completed",
    output,
    completedAt: new Date().toISOString()
  };
}

export function failRun(run: WorkflowRun, error: unknown): WorkflowRun {
  return {
    ...run,
    status: "failed",
    error: error instanceof Error ? error.message : "Workflow execution failed",
    completedAt: new Date().toISOString()
  };
}

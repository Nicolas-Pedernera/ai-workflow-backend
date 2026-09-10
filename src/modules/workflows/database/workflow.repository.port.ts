import type { Workflow, WorkflowRun } from "../domain/workflow.types.js";

export interface WorkflowRepositoryPort {
  saveWorkflow(workflow: Workflow): Promise<Workflow>;
  findAllWorkflows(): Promise<Workflow[]>;
  findWorkflowById(id: string): Promise<Workflow | undefined>;
  saveRun(run: WorkflowRun): Promise<WorkflowRun>;
  findRunById(id: string): Promise<WorkflowRun | undefined>;
}

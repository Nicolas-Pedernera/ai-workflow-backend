import type { Workflow, WorkflowRun } from "../../src/modules/workflows/domain/workflow.types.js";
import type { WorkflowRepositoryPort } from "../../src/modules/workflows/database/workflow.repository.port.js";

export class InMemoryWorkflowRepository implements WorkflowRepositoryPort {
  private workflows = new Map<string, Workflow>();
  private runs = new Map<string, WorkflowRun>();

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async findAllWorkflows(): Promise<Workflow[]> {
    return [...this.workflows.values()];
  }

  async findWorkflowById(id: string): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async saveRun(run: WorkflowRun): Promise<WorkflowRun> {
    this.runs.set(run.id, run);
    return run;
  }

  async findRunById(id: string): Promise<WorkflowRun | undefined> {
    return this.runs.get(id);
  }
}

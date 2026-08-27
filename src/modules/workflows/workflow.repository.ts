import type {
  Workflow,
  WorkflowRun
} from "./workflow.types.js";

export class WorkflowRepository {
  private readonly workflows = new Map<string, Workflow>();

  private readonly runs = new Map<string, WorkflowRun>();

  saveWorkflow(workflow: Workflow): Workflow {
    this.workflows.set(workflow.id, workflow);

    return workflow;
  }

  findAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  findWorkflowById(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  saveRun(run: WorkflowRun): WorkflowRun {
    this.runs.set(run.id, run);

    return run;
  }

  findRunById(id: string): WorkflowRun | undefined {
    return this.runs.get(id);
  }
}

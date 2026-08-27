import type {
  CreateWorkflowInput,
  Workflow,
  WorkflowRun
} from "./workflow.types.js";

export class WorkflowService {
  private readonly workflows = new Map<string, Workflow>();

  private readonly runs = new Map<string, WorkflowRun>();

  private workflowCounter = 0;

  private runCounter = 0;

  list(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  getById(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  create(input: CreateWorkflowInput): Workflow {
    const now = new Date().toISOString();

    this.workflowCounter += 1;

    const workflow: Workflow = {
      id: `wf_${this.workflowCounter}`,
      name: input.name,
      description: input.description ?? "",
      status: "active",
      createdAt: now,
      updatedAt: now
    };

    this.workflows.set(workflow.id, workflow);

    return workflow;
  }

  run(
    workflowId: string,
    input: Record<string, unknown> = {}
  ): WorkflowRun | undefined {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      return undefined;
    }

    const now = new Date().toISOString();

    this.runCounter += 1;

    const run: WorkflowRun = {
      id: `run_${this.runCounter}`,
      workflowId,
      status: "completed",
      input,
      output: {
        message: `Workflow "${workflow.name}" executed successfully`,
        workflowId
      },
      error: null,
      createdAt: now,
      startedAt: now,
      completedAt: now
    };

    this.runs.set(run.id, run);

    return run;
  }

  getRunById(id: string): WorkflowRun | undefined {
    return this.runs.get(id);
  }
}

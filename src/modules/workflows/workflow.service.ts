import { WorkflowRepository } from "./workflow.repository.js";
import type {
  CreateWorkflowInput,
  Workflow,
  WorkflowRun
} from "./workflow.types.js";

export class WorkflowService {
  private readonly repository: WorkflowRepository;

  private workflowCounter = 0;

  private runCounter = 0;

  constructor(repository = new WorkflowRepository()) {
    this.repository = repository;
  }

  list(): Workflow[] {
    return this.repository.findAllWorkflows();
  }

  getById(id: string): Workflow | undefined {
    return this.repository.findWorkflowById(id);
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

    return this.repository.saveWorkflow(workflow);
  }

  run(
    workflowId: string,
    input: Record<string, unknown> = {}
  ): WorkflowRun | undefined {
    const workflow = this.repository.findWorkflowById(workflowId);

    if (!workflow) {
      return undefined;
    }

    const createdAt = new Date().toISOString();

    this.runCounter += 1;

    const run: WorkflowRun = {
      id: `run_${this.runCounter}`,
      workflowId,
      status: "pending",
      input,
      output: null,
      error: null,
      createdAt,
      startedAt: null,
      completedAt: null
    };

    this.repository.saveRun(run);

    run.status = "running";
    run.startedAt = new Date().toISOString();

    if (input.fail === true) {
      run.status = "failed";
      run.error = "Workflow execution failed";
      run.completedAt = new Date().toISOString();

      return this.repository.saveRun(run);
    }

    run.status = "completed";
    run.output = {
      message: `Workflow "${workflow.name}" executed successfully`,
      workflowId,
      processedInput: input
    };
    run.completedAt = new Date().toISOString();

    return this.repository.saveRun(run);
  }

  getRunById(id: string): WorkflowRun | undefined {
    return this.repository.findRunById(id);
  }
}

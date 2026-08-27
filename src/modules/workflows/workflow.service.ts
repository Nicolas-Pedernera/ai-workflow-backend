import { WorkflowRepository } from "./workflow.repository.js";
import type {
  CreateWorkflowInput,
  Workflow,
  WorkflowRun
} from "./workflow.types.js";
import { AIProviderFactory } from "../../providers/ai/ai-provider.factory.js";
import type { AIProvider } from "../../providers/ai/ai-provider.js";

export class WorkflowService {
  private readonly repository: WorkflowRepository;
  private readonly aiProvider: AIProvider;

  private workflowCounter = 0;

  private runCounter = 0;

  constructor(
    repository = new WorkflowRepository(),
    aiProvider = AIProviderFactory.create()
  ) {
    this.repository = repository;
    this.aiProvider = aiProvider;
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

  async run(
    workflowId: string,
    input: Record<string, unknown> = {}
  ): Promise<WorkflowRun | undefined> {
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

    try {
      if (input.fail === true) {
        throw new Error("Workflow execution failed");
      }

      const prompt =
        typeof input.prompt === "string"
          ? input.prompt
          : JSON.stringify(input);

      const providerOutput = await this.aiProvider.generate(prompt);

      run.status = "completed";
      run.output = {
        message: providerOutput,
        workflowId,
        processedInput: input
      };
      run.completedAt = new Date().toISOString();

      return this.repository.saveRun(run);
    } catch (error) {
      run.status = "failed";
      run.error =
        error instanceof Error
          ? error.message
          : "Workflow execution failed";
      run.completedAt = new Date().toISOString();

      return this.repository.saveRun(run);
    }
  }

  getRunById(id: string): WorkflowRun | undefined {
    return this.repository.findRunById(id);
  }
}

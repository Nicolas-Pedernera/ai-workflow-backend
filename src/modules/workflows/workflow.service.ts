import crypto from "node:crypto";
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

  constructor(
    repository = new WorkflowRepository(),
    aiProvider = AIProviderFactory.create()
  ) {
    this.repository = repository;
    this.aiProvider = aiProvider;
  }

  async list(): Promise<Workflow[]> {
    return this.repository.findAllWorkflows();
  }

  async getById(id: string): Promise<Workflow | undefined> {
    return this.repository.findWorkflowById(id);
  }

  async create(input: CreateWorkflowInput): Promise<Workflow> {
    const now = new Date().toISOString();

    const workflow: Workflow = {
      id: `wf_${crypto.randomUUID()}`,
      name: input.name,
      description: input.description ?? "",
      status: "active",
      createdAt: now,
      updatedAt: now,
      blockchainId: null,
      blockchainTransactionHash: null
    };

    return await this.repository.saveWorkflow(workflow);
  }

  async run(
    workflowId: string,
    input: Record<string, unknown> = {}
  ): Promise<WorkflowRun | undefined> {
    const workflow = await this.repository.findWorkflowById(workflowId);

    if (!workflow) {
      return undefined;
    }

    const createdAt = new Date().toISOString();

    const run: WorkflowRun = {
      id: `run_${crypto.randomUUID()}`,
      workflowId,
      status: "pending",
      input,
      output: null,
      error: null,
      createdAt,
      startedAt: null,
      completedAt: null
    };

    await this.repository.saveRun(run);

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

      return await this.repository.saveRun(run);
    } catch (error) {
      run.status = "failed";
      run.error =
        error instanceof Error
          ? error.message
          : "Workflow execution failed";
      run.completedAt = new Date().toISOString();

      return await this.repository.saveRun(run);
    }
  }

  async getRunById(id: string): Promise<WorkflowRun | undefined> {
    return await this.repository.findRunById(id);
  }
}

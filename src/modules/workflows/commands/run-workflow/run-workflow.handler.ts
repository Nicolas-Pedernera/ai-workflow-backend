import type { AIProvider } from "../../../../providers/ai/ai-provider.js";
import { analyzeRisk } from "../../../risk/domain/risk-analyzer.js";
import type { WorkflowRepositoryPort } from "../../database/workflow.repository.port.js";
import {
  completeRun,
  createPendingRun,
  failRun,
  startRun
} from "../../domain/workflow.domain.js";
import { WorkflowNotFoundError } from "../../domain/workflow.errors.js";
import type { WorkflowRun } from "../../domain/workflow.types.js";

export interface RunWorkflowPayload {
  workflowId: string;
  input: Record<string, unknown>;
}

export interface RunWorkflowDeps {
  repository: WorkflowRepositoryPort;
  aiProvider: AIProvider;
}

export function runWorkflowHandler({ repository, aiProvider }: RunWorkflowDeps) {
  return async ({ workflowId, input }: RunWorkflowPayload): Promise<WorkflowRun> => {
    const workflow = await repository.findWorkflowById(workflowId);

    if (!workflow) {
      throw new WorkflowNotFoundError(workflowId);
    }

    let run = createPendingRun(workflowId, input);
    await repository.saveRun(run);

    run = startRun(run);

    try {
      if (input.fail === true) {
        throw new Error("Workflow execution failed");
      }

      const riskAnalysis = analyzeRisk(input);

      const prompt =
        typeof input.prompt === "string"
          ? input.prompt
          : riskAnalysis
            ? [
                "Analyze the following deterministic risk metrics.",
                "Do not recalculate or invent financial values.",
                "Explain the risk clearly and concisely.",
                JSON.stringify(riskAnalysis, null, 2)
              ].join("\n")
            : JSON.stringify(input);

      const providerOutput = await aiProvider.generate(prompt);

      run = completeRun(run, {
        message: providerOutput,
        workflowId,
        processedInput: input,
        ...(riskAnalysis ? { riskAnalysis } : {})
      });

      return repository.saveRun(run);
    } catch (error) {
      run = failRun(run, error);
      return repository.saveRun(run);
    }
  };
}

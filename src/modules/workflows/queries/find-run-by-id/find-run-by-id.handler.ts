import type { WorkflowRepositoryPort } from "../../database/workflow.repository.port.js";
import { WorkflowRunNotFoundError } from "../../domain/workflow.errors.js";
import type { WorkflowRun } from "../../domain/workflow.types.js";

export function findRunByIdHandler(repository: WorkflowRepositoryPort) {
  return async (id: string): Promise<WorkflowRun> => {
    const run = await repository.findRunById(id);
    if (!run) throw new WorkflowRunNotFoundError(id);
    return run;
  };
}

import type { WorkflowRepositoryPort } from "../../database/workflow.repository.port.js";
import { WorkflowNotFoundError } from "../../domain/workflow.errors.js";
import type { Workflow } from "../../domain/workflow.types.js";

export function findWorkflowByIdHandler(repository: WorkflowRepositoryPort) {
  return async (id: string): Promise<Workflow> => {
    const workflow = await repository.findWorkflowById(id);
    if (!workflow) throw new WorkflowNotFoundError(id);
    return workflow;
  };
}

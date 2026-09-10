import type { WorkflowRepositoryPort } from "../../database/workflow.repository.port.js";
import type { Workflow } from "../../domain/workflow.types.js";

export function findWorkflowsHandler(repository: WorkflowRepositoryPort) {
  return async (): Promise<Workflow[]> => repository.findAllWorkflows();
}

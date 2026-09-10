import { InvalidWorkflowNameError } from "../../domain/workflow.errors.js";
import { ValidationException } from "../../../../shared/exceptions/base.exception.js";
import type { CreateWorkflowInput } from "../../domain/workflow.types.js";

export function parseCreateWorkflowBody(body: unknown): CreateWorkflowInput {
  const parsed = body as { name?: unknown; description?: unknown };

  if (typeof parsed?.name !== "string" || parsed.name.trim().length === 0) {
    throw new InvalidWorkflowNameError();
  }

  if (parsed.description !== undefined && typeof parsed.description !== "string") {
    throw new ValidationException("description must be a string");
  }

  return { name: parsed.name.trim(), description: parsed.description };
}

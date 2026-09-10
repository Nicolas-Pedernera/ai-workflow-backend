import { NotFoundException, ValidationException } from "../../../shared/exceptions/base.exception.js";

export class WorkflowNotFoundError extends NotFoundException {
  constructor(id: string) {
    super(`Workflow "${id}" not found`);
  }
}

export class WorkflowRunNotFoundError extends NotFoundException {
  constructor(id: string) {
    super(`Workflow run "${id}" not found`);
  }
}

export class InvalidWorkflowNameError extends ValidationException {
  constructor() {
    super("name is required and must be a non-empty string");
  }
}

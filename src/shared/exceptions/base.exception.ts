export abstract class BaseException extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundException extends BaseException {
  readonly statusCode = 404;
  readonly code = "NOT_FOUND";
}

export class ValidationException extends BaseException {
  readonly statusCode = 400;
  readonly code = "VALIDATION_ERROR";
}

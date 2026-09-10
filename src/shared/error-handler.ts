import type { FastifyInstance } from "fastify";
import { BaseException } from "./exceptions/base.exception.js";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof BaseException) {
      return reply.status(error.statusCode).send({
        status: "error",
        error: error.code,
        message: error.message
      });
    }

    app.log.error(error);

    return reply.status(500).send({
      status: "error",
      error: "Internal Server Error",
      message: "Unexpected error"
    });
  });
}

import type { Action, Handler, Middleware } from "./types.js";

/**
 * Bus genérico usado tanto para comandos como para queries.
 * Los módulos registran handlers por tipo de acción; el bus
 * desacopla al que dispara la acción (route/resolver) de quien
 * la resuelve (handler), evitando imports directos entre módulos.
 */
export function createBus() {
  const handlers = new Map<string, Handler>();
  const middlewares: { pattern: RegExp; middleware: Middleware }[] = [];

  function register<TPayload, TResult>(
    type: string,
    handler: Handler<TPayload, TResult>
  ): void {
    // Sobrescribe intencionalmente: permite que cada buildApp() (p. ej. en tests)
    // recomponga el módulo con dependencias distintas sin arrancar un proceso nuevo.
    handlers.set(type, handler as Handler);
  }

  function use(pattern: string, middleware: Middleware): void {
    const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
    middlewares.push({ pattern: regex, middleware });
  }

  async function execute<TResult = unknown>(
    action: Action
  ): Promise<TResult> {
    const handler = handlers.get(action.type);

    if (!handler) {
      throw new Error(`No handler registered for action "${action.type}"`);
    }

    const applicable = middlewares.filter(({ pattern }) =>
      pattern.test(action.type)
    );

    const chain = applicable.reduceRight<
      (action: Action) => Promise<unknown>
    >(
      (next, { middleware }) => (currentAction) =>
        middleware(currentAction, next),
      async (currentAction) => handler(currentAction.payload)
    );

    return chain(action) as Promise<TResult>;
  }

  return { register, use, execute };
}

export const commandBus = createBus();
export const queryBus = createBus();

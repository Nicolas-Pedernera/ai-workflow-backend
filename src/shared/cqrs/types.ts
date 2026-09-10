export interface Action<TPayload = unknown> {
  type: string;
  payload: TPayload;
}

export type Handler<TPayload = unknown, TResult = unknown> = (
  payload: TPayload
) => Promise<TResult>;

export type Middleware = (
  action: Action,
  next: (action: Action) => Promise<unknown>
) => Promise<unknown>;

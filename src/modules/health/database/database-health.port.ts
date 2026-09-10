import type { HealthCheck } from "../domain/health.types.js";

export interface DatabaseHealthPort {
  checkDatabase(): Promise<HealthCheck>;
}

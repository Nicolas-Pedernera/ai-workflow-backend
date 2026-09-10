export interface HealthCheck {
  status: "ok" | "error";
  latencyMs?: number;
  error?: string;
}

export interface ReadinessResult {
  status: "ready" | "not_ready";
  checks: {
    database: HealthCheck;
    blockchain: HealthCheck;
  };
}

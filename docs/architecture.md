# Architecture

AI Workflow Backend is a modular TypeScript backend for AI-powered workflow orchestration with PostgreSQL persistence and EVM blockchain verification.

## Overview

```text
Client
  |
  v
Fastify API
  |
  v
WorkflowService
  |--------- PostgreSQL
  |
  |--------- AI Provider
  |             |-- Mock
  |             |-- Ollama
  |             |-- OpenAI-compatible
  |
  `--------- Blockchain
                |
                `-- WorkflowRegistry
```

## Main modules

- `src/app.ts` — Fastify application and centralized error handling.
- `src/modules/workflows/` — workflow routes, repository and orchestration.
- `src/modules/blockchain/` — EVM integration.
- `src/modules/risk/` — deterministic risk analysis.
- `src/modules/health/` — health and readiness checks.
- `src/providers/ai/` — AI provider abstraction and implementations.

## Workflow creation

1. Generate workflow ID.
2. Register workflow on-chain.
3. Store blockchain ID and transaction hash.
4. Persist workflow in PostgreSQL.

## Workflow execution

1. Load workflow.
2. Create pending run.
3. Mark run as running.
4. Run deterministic risk analysis when configured.
5. Execute the AI provider.
6. Persist completed or failed result.

## Design principles

- Separation of concerns
- Provider abstraction
- Deterministic testing
- Explicit configuration
- Centralized error handling
- Blockchain verification

# AI Workflow Backend

AI-assisted risk and liquidation alerting engine for leveraged trading positions, with an immutable on-chain audit trail for every workflow executed.

## Overview

This project is a TypeScript backend built to run automated risk workflows on trading positions: feed in position data (collateral, price, liquidation ratio), have an AI provider analyze the risk and draft a human-readable alert, and register that workflow on-chain so the alert's existence is auditable and cannot be altered after the fact.

It combines three things that are rarely found together in a single, understandable codebase: a real AI provider abstraction (not a black box), workflow orchestration with persistent state, and an EVM smart contract that gives every workflow an immutable on-chain record. This is the backend layer that a project like [MarginVault](https://github.com/Nicolas-Pedernera/MarginVault) would sit on top of in production.

The architecture focuses on clear separation of responsibilities, persistent application state, testability, and extensibility for future AI providers and workflow execution strategies.

The project is actively developed as part of my engineering portfolio and demonstrates practical backend architecture using Node.js, Fastify, PostgreSQL, TypeScript, Solidity, and automated testing.

## Use Case: Liquidation Risk Alerts

A workflow represents a recurring risk check. When you run it with position data, the AI provider evaluates the risk and returns a plain-language alert — and the run is persisted with the exact input, output, and timestamps, while the workflow itself carries an on-chain registration hash.

```bash
# 1. Create a workflow
curl -X POST http://localhost:3000/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{"name": "eth-margin-risk-check"}'

# 2. Run it against a position snapshot
curl -X POST http://localhost:3000/api/v1/workflows/<id>/run \
  -H "Content-Type: application/json" \
  -d '{"input": {"prompt": "Position: 2.5 ETH collateral, 4000 USDC borrowed, liquidation price $1850, current price $1920. Assess liquidation risk in one sentence."}}'
```

The response includes the AI-generated risk assessment alongside the run's audit trail (`createdAt`, `startedAt`, `completedAt`) and the workflow's on-chain `blockchainTransactionHash`. Today this is a manual trigger; the natural next step (see [Roadmap](#roadmap)) is wiring it to a scheduler or webhook so it runs automatically as prices move.

## Architecture

```text
REST API (Fastify)
        |
        v
Workflow Routes
        |
        v
Workflow Service
        |
        +-------------------+-------------------+
        |                   |                   |
        v                   v                   v
Workflow Repository   AI Provider Abstraction   Blockchain Service
        |                   |                   |
        v                   v                   v
PostgreSQL           AI Provider(s)      WorkflowRegistry.sol (EVM)
```

## Core Features

- REST API built with Fastify
- Strongly typed TypeScript codebase
- Workflow creation and retrieval
- Workflow execution lifecycle
- PostgreSQL persistence
- SQL migrations tracked in version control and applied via a migration runner script
- Repository pattern for data access
- Service layer for business logic
- AI provider abstraction, selectable via `AI_PROVIDER` env var
- AI providers: deterministic mock for testing and Ollama for local inference
- Mock AI provider for fast, deterministic tests
- On-chain workflow registration via a Solidity smart contract
- Blockchain service layer built on viem
- Isolated test database with automatic cleanup between tests
- Automated API and integration tests with Vitest
- ESLint-based code quality checks
- TypeScript production build
- Docker Compose development environment

## Project Structure

```text
contracts/
└── WorkflowRegistry.sol

hardhat-tests/
└── WorkflowRegistry.ts

migrations/
├── 001_init.sql
└── 002_add_blockchain_fields.sql

scripts/
├── deploy-workflow-registry.ts
├── migrate.ts
└── test-blockchain.ts

src/
├── app.ts
├── server.ts
├── config/
│   └── database.ts
├── modules/
│   ├── blockchain/
│   │   └── blockchain.service.ts
│   ├── health/
│   │   └── health.service.ts
│   └── workflows/
│       ├── workflow.repository.ts
│       ├── workflow.routes.ts
│       ├── workflow.service.ts
│       └── workflow.types.ts
└── providers/
    └── ai/
        ├── ai-provider.factory.ts
        ├── ai-provider.ts
        ├── ollama-ai-provider.ts
        └── mock-ai-provider.ts

test/
├── app.test.ts
├── blockchain-integration.test.ts
├── setup.ts
├── workflow-service.test.ts
└── workflows.test.ts
```

## Workflow Lifecycle

Create Workflow -> Persist Workflow -> Register On-Chain (optional) -> Execute Workflow -> Create Run -> Track Execution State

## AI Provider Abstraction

AI integrations are isolated behind an explicit provider interface (`generate(input: string): Promise<string>`). This avoids coupling the workflow engine to a specific AI vendor and allows providers to be replaced or extended independently.

The active provider is selected with the `AI_PROVIDER` env var:

| Value | Provider | Requirements |
|---|---|---|
| `mock` (default) | Deterministic mock, no external calls | None |
| `ollama` | Local inference via [Ollama](https://ollama.com) | Ollama running locally, no API key |

For local development without any API costs: `ollama pull llama3.2`, set `AI_PROVIDER=ollama`, and the workflow engine talks to a real model running on your machine.

## Blockchain Integration

Workflows can be registered on an EVM-compatible chain through the `WorkflowRegistry` smart contract, which tracks ownership and active status on-chain. The `blockchain.service.ts` module wraps contract interaction using `viem`, keeping on-chain logic isolated from the core workflow service.

Contract tests are written with Hardhat and live under `hardhat-tests/`.

## Database Migrations

Schema changes are tracked as plain SQL files under `migrations/` and applied with the migration runner script:

```bash
npm run db:migrate
```

## API

- GET /health
- GET /api/v1/status
- POST /api/v1/workflows
- GET /api/v1/workflows
- GET /api/v1/workflows/:id
- POST /api/v1/workflows/:id/run
- GET /api/v1/runs/:id

## Tech Stack

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- pg
- Solidity
- Hardhat
- viem
- Vitest
- ESLint
- Docker Compose

## Local Development

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:migrate
npm run dev
```

The first `docker compose up -d` on a fresh volume automatically provisions both the main and test databases. On an existing local volume, the test database can be created manually:

```bash
docker compose exec postgres createdb -U ai_workflow_user ai_workflow_test
DATABASE_URL=$DATABASE_TEST_URL npm run db:migrate
```

## Quality Checks

```bash
npm run build
npm test
npm run lint
```

Current test status: **4 test files passed / 20 tests passed**.

## Engineering Principles

- Separation of concerns
- Strong typing
- Explicit domain boundaries
- Repository-based persistence
- AI provider abstraction
- Isolated on-chain logic
- Testable business logic
- Persistent application state
- Clear API boundaries

## Roadmap

- Asynchronous workflow execution
- Background job processing
- Redis-based caching
- Event-driven workflow execution
- Additional AI providers
- Webhook processing
- Authentication and authorization
- Observability and metrics
- Rate limiting
- Distributed execution
- Production deployment automation
- Mainnet deployment of WorkflowRegistry

## License

MIT — see [LICENSE](./LICENSE) for details.

## Author

**Nicolás Pedernera**

Systems Engineer — Universidad de Buenos Aires, 2024

Focused on backend engineering, fintech, cryptocurrency, blockchain infrastructure, and AI systems.

GitHub: https://github.com/Nicolas-Pedernera
LinkedIn: https://www.linkedin.com/in/nicolas-pedernera-zendx/
Upwork: https://www.upwork.com/freelancers/~017eec2171ae9d8805

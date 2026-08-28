# AI Workflow Backend

Production-oriented backend for AI workflow orchestration, automation, REST APIs, and intelligent agent systems — with on-chain workflow registration on an EVM-compatible network.

## Overview

This project is a TypeScript backend designed around workflow creation, execution, persistence, and AI provider abstraction. It also integrates a Solidity smart contract that registers workflow ownership and status on-chain, bridging the off-chain application state with an on-chain source of truth.

The architecture focuses on clear separation of responsibilities, persistent application state, testability, and extensibility for future AI providers and workflow execution strategies.

The project is actively developed as part of my engineering portfolio and demonstrates practical backend architecture using Node.js, Fastify, PostgreSQL, TypeScript, Solidity, and automated testing.

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
- AI provider abstraction
- Mock AI provider for development and testing
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

AI integrations are isolated behind an explicit provider interface. This avoids coupling the workflow engine to a specific AI vendor and allows providers to be replaced or extended independently.

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

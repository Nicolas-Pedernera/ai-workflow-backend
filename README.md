# AI Workflow Backend

Production-oriented backend for AI workflow orchestration, automation, REST APIs, and intelligent agent systems.

## Overview

This project is a TypeScript backend designed around workflow creation, execution, persistence, and AI provider abstraction.

The architecture focuses on clear separation of responsibilities, persistent application state, testability, and extensibility for future AI providers and workflow execution strategies.

The project is actively developed as part of my engineering portfolio and demonstrates practical backend architecture using Node.js, Fastify, PostgreSQL, TypeScript, and automated testing.

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
        +-------------------+
        |                   |
        v                   v
Workflow Repository   AI Provider Abstraction
        |                   |
        v                   v
PostgreSQL           AI Provider(s)
```

## Core Features

- REST API built with Fastify
- Strongly typed TypeScript codebase
- Workflow creation and retrieval
- Workflow execution lifecycle
- PostgreSQL persistence
- Repository pattern for data access
- Service layer for business logic
- AI provider abstraction
- Mock AI provider for development and testing
- Automated API tests with Vitest
- ESLint-based code quality checks
- TypeScript production build
- Docker Compose development environment

## Project Structure

```text
src/
├── app.ts
├── server.ts
├── config/
│   └── database.ts
├── modules/
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
└── workflows.test.ts
```

## Workflow Lifecycle

Create Workflow -> Persist Workflow -> Execute Workflow -> Create Run -> Track Execution State

## AI Provider Abstraction

AI integrations are isolated behind an explicit provider interface. This avoids coupling the workflow engine to a specific AI vendor and allows providers to be replaced or extended independently.

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
- Vitest
- ESLint
- Docker Compose

## Local Development

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

## Quality Checks

```bash
npm run build
npm test
npm run lint
```

Current test status: **2 test files passed / 10 tests passed**.

## Engineering Principles

- Separation of concerns
- Strong typing
- Explicit domain boundaries
- Repository-based persistence
- AI provider abstraction
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

## Author

**Nicolás Pedernera**

Systems Engineer — Universidad de Buenos Aires, 2024

Focused on backend engineering, fintech, cryptocurrency, blockchain infrastructure, and AI systems.

GitHub: https://github.com/Nicolas-Pedernera
LinkedIn: https://www.linkedin.com/in/nicolas-pedernera-zendx/
Upwork: https://www.upwork.com/freelancers/~017eec2171ae9d8805

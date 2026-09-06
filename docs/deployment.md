# Deployment

## Requirements

- Node.js 20+
- PostgreSQL
- EVM-compatible RPC endpoint
- Deployed WorkflowRegistry contract
- Configured AI provider

## Installation

```bash
npm ci
```

## Configuration

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Configure environment-specific values.

## Database

```bash
npm run db:migrate
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Docker

The repository includes Docker Compose configuration for local infrastructure.

```bash
docker compose up -d
```

## Production checklist

- Use production PostgreSQL credentials.
- Use a production RPC endpoint.
- Never commit `.env`.
- Never use Hardhat development keys.
- Configure the production AI provider.
- Restrict network access.
- Store secrets securely.
- Run tests before deployment.

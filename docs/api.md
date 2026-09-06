# API Reference

Base URL: `http://localhost:3000`

## Health

### GET /health

Returns basic service health.

### GET /health/ready

Checks database and blockchain dependencies.

## Status

### GET /api/v1/status

Returns service version, environment and uptime.

## Workflows

### GET /api/v1/workflows

Lists workflows.

### POST /api/v1/workflows

Creates a workflow, registers it on-chain and persists it in PostgreSQL.

Example request:

```json
{
  "name": "Document Processing",
  "description": "AI document processing workflow"
}
```

### GET /api/v1/workflows/:id

Returns a workflow by ID.

### PATCH /api/v1/workflows/:id/status

Updates workflow status and synchronizes the blockchain state.

### GET /api/v1/workflows/:id/blockchain

Returns the workflow blockchain representation.

## Execution

### POST /api/v1/workflows/:id/run

Executes a workflow through the configured AI provider.

### GET /api/v1/runs/:id

Returns workflow execution details and output.

## Execution lifecycle

```text
pending -> running -> completed
                    |
                    -> failed
```

## Errors

The API uses centralized error handling and structured HTTP responses.

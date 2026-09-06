# Contributing

Thank you for contributing to AI Workflow Backend.

## Development setup

```bash
npm ci
```

Configure `.env` using `.env.example`.

## Validation

Before submitting changes:

```bash
npm test
npm run build
npm run lint
```

All checks should pass.

## Pull requests

Pull requests should:

- explain the purpose of the change
- keep changes focused
- include tests for new behavior when appropriate
- update documentation when behavior changes
- never commit secrets or credentials

## Commit messages

Use clear and descriptive commit messages.

Examples:

```text
feat: add workflow execution endpoint
fix: handle missing blockchain wallet
docs: improve deployment guide
test: add workflow service coverage
```

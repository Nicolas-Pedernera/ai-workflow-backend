# Development Guide

## Install

```bash
npm ci
```

## Development server

```bash
npm run dev
```

The default port is `3000`.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Database

```bash
npm run db:migrate
```

## Local blockchain

```bash
npx hardhat node
```

Deploy:

```bash
npx hardhat run scripts/deploy-workflow-registry.ts --network localhost
```

## Recommended validation

Before submitting changes:

```bash
npm test
npm run build
npm run lint
```

## Project structure

```text
src/
├── config/
├── modules/
│   ├── blockchain/
│   ├── health/
│   ├── risk/
│   └── workflows/
├── providers/
│   └── ai/
├── app.ts
└── server.ts

contracts/
scripts/
test/
migrations/
docs/
```

Never commit secrets or private keys.

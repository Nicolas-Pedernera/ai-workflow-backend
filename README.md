# AI Workflow Backend

AI-assisted risk and liquidation alerting backend for leveraged trading workflows, combining deterministic financial calculations, AI-generated explanations, persistent execution state, and blockchain-backed workflow registration.

Built with **TypeScript, Fastify, PostgreSQL, Ollama, Solidity, viem, Hardhat, and Vitest**.

![Live run proof](docs/proof-card.png)


## Overview

This project demonstrates a modular backend architecture for executing AI-assisted workflows against structured financial data.

The current use case focuses on **liquidation risk analysis for leveraged trading positions**.

A workflow can:

1. Receive structured trading position data.
2. Calculate deterministic risk metrics.
3. Send those metrics to an AI provider.
4. Generate a human-readable risk assessment.
5. Persist the workflow execution in PostgreSQL.
6. Maintain workflow lifecycle state.
7. Register workflows on-chain through an EVM-compatible smart contract.

The deterministic risk engine is intentionally separated from the AI layer so that financial calculations do not depend on the language model.

---

## Architecture

```text
Client / API
     |
     v
+----------------------+
|     Fastify API      |
|    REST Endpoints    |
+----------+-----------+
           |
           v
+----------------------+
|   WorkflowService    |
|    Orchestration     |
+----+-------------+---+
     |             |
     |             v
     |     +----------------------+
     |     | Deterministic Risk   |
     |     |      Analyzer        |
     |     |                      |
     |     | Exposure             |
     |     | Price Change         |
     |     | PnL                  |
     |     | Equity               |
     |     | Liquidation Price    |
     |     | Risk Level            |
     |     +----------+-----------+
     |                |
     |                v
     |     +----------------------+
     |     |     AI Provider      |
     |     |                      |
     |     | Ollama / Mock        |
     |     +----------+-----------+
     |                |
     |                v
     |        Risk Assessment
     |
     v
+----------------------+
|      PostgreSQL      |
|  Workflows + Runs    |
+----------------------+

           |
           v
+----------------------+
|   WorkflowRegistry   |
|    Solidity / EVM    |
+----------------------+

---

## Use Case: Liquidation Risk Alerts

A workflow can be run against a leveraged trading position. The backend calculates the deterministic risk metrics first, then asks the AI provider to explain them in plain language — the model never invents the numbers, it only interprets ones already computed.

```bash
# 1. Create a workflow
curl -X POST http://localhost:3000/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{"name": "eth-margin-risk-check"}'

# 2. Run it against a position
curl -X POST http://localhost:3000/api/v1/workflows/<id>/run \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "asset": "ETH",
      "position": "long",
      "entryPrice": 3200,
      "currentPrice": 2850,
      "leverage": 5,
      "collateral": 1000
    }
  }'
```

The response includes the computed `riskAnalysis` (exposure, PnL, equity, estimated liquidation price, risk level) alongside the AI-generated explanation, the run's audit trail, and the workflow's on-chain `blockchainTransactionHash`.

## AI Provider Abstraction

AI integrations are isolated behind an explicit provider interface (`generate(input: string): Promise<string>`), so the workflow engine is not coupled to a specific AI vendor.

The active provider is selected with the `AI_PROVIDER` env var:

| Value | Provider | Requirements |
|---|---|---|
| `mock` (default) | Deterministic mock, no external calls | None |
| `ollama` | Local inference via [Ollama](https://ollama.com) | Ollama running locally, no API key |

For local development without any API costs: `ollama pull llama3.2`, set `AI_PROVIDER=ollama`.

## API Endpoints

```http
GET    /health
GET    /health/ready
GET    /api/v1/status

GET    /api/v1/workflows
POST   /api/v1/workflows
GET    /api/v1/workflows/:id
PATCH  /api/v1/workflows/:id/status
GET    /api/v1/workflows/:id/blockchain
POST   /api/v1/workflows/:id/run

GET    /api/v1/runs/:id
```

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| HTTP API | Fastify |
| Database | PostgreSQL |
| AI | Ollama / Llama 3.2 |
| Blockchain | Solidity / EVM |
| Blockchain client | viem |
| Smart contract tooling | Hardhat |
| Testing | Vitest |
| Linting | ESLint |

## Local Development

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:migrate
npm run dev
```

The API runs on `http://localhost:3000`.

## Testing

```bash
npm run build
npm test
npm run lint
```

Current test status: **6 test files passed / 29 tests passed**.

## Limitations

This is a portfolio and educational project, not a production trading or liquidation engine. The risk model is intentionally simplified — it excludes maintenance margin, trading fees, funding, slippage, and exchange-specific liquidation rules — and should not be used to make real financial decisions.

## Roadmap

- [ ] Authentication and API keys
- [ ] Scheduled / webhook-triggered workflow execution
- [ ] Real-time market data integration
- [ ] Additional AI providers
- [ ] Workflow execution history and analytics
- [ ] OpenAPI documentation
- [ ] Rate limiting and observability

## License

MIT

## Author

**Nicolás Pedernera**

Systems Engineer — Universidad de Buenos Aires, 2024

Focused on backend engineering, fintech, cryptocurrency, blockchain infrastructure, and AI systems.

GitHub: https://github.com/Nicolas-Pedernera
LinkedIn: https://www.linkedin.com/in/nicolas-pedernera-zendx/
Upwork: https://www.upwork.com/freelancers/~017eec2171ae9d8805

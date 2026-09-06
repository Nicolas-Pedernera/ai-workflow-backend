# Blockchain Integration

The backend integrates with an EVM-compatible `WorkflowRegistry` smart contract.

## WorkflowRegistry

The contract provides an on-chain representation of workflows.

The backend tracks:

- workflow identifier
- owner
- active state
- creation timestamp
- blockchain transaction hash

## Local development

Start Hardhat:

```bash
npx hardhat node
```

Deploy the registry:

```bash
npx hardhat run scripts/deploy-workflow-registry.ts --network localhost
```

Configure:

```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_PRIVATE_KEY=<local-development-key>
WORKFLOW_REGISTRY_ADDRESS=<deployed-address>
```

## Read and write operations

Read operations can work without a private key.

Blockchain writes require `BLOCKCHAIN_PRIVATE_KEY`.

## Security

Never use a Hardhat development private key in production.

Production deployments should use:

- dedicated wallets
- secure secret management
- restricted permissions
- production RPC infrastructure
- transaction monitoring

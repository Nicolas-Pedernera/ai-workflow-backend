# Security Model

## Secrets

Secrets must be supplied through environment variables or a secret manager.

Never commit:

- API keys
- private keys
- passwords
- production credentials
- database credentials

## Blockchain

Blockchain writes require an explicitly configured wallet.

Production wallets must not use development Hardhat accounts.

## AI providers

AI providers are isolated behind a common interface.

Applications processing sensitive data should review the privacy and retention policies of the selected provider.

Ollama provides a local inference option.

## Database

Production databases should use:

- strong credentials
- encrypted connections where appropriate
- network restrictions
- backups
- least-privilege accounts

## API

Production deployments should implement authentication, authorization, rate limiting and appropriate observability.

## Vulnerability reporting

Do not publicly disclose security vulnerabilities before they have been responsibly reported and investigated.

See `SECURITY.md`.

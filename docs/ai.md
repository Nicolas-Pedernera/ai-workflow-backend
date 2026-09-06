# AI Providers

The backend supports multiple AI providers through a common interface.

## Supported providers

### Mock

Deterministic provider for tests and local development.

```env
AI_PROVIDER=mock
```

### Ollama

Local AI inference without requiring an external API.

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### OpenAI-compatible

Supports OpenAI-compatible APIs.

```env
AI_PROVIDER=remote
REMOTE_AI_API_KEY=your-api-key
REMOTE_AI_BASE_URL=https://api.openai.com/v1
REMOTE_AI_MODEL=gpt-4o-mini
```

## Architecture

```text
WorkflowService
      |
      v
AIProviderFactory
      |
      +-- MockAIProvider
      +-- OllamaAIProvider
      +-- OpenAICompatibleAIProvider
```

The workflow layer is independent of the selected AI vendor.

## Security

- Never commit API keys.
- Keep secrets in .env or a secret manager.
- Use local inference when appropriate for sensitive development data.
- Review provider data-processing policies before production use.

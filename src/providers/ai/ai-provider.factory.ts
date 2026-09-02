import { AIProvider } from "./ai-provider.js";
import { MockAIProvider } from "./mock-ai-provider.js";
import { OllamaAIProvider } from "./ollama-ai-provider.js";
import { OpenAICompatibleAIProvider } from "./openai-compatible-ai-provider.js";

export class AIProviderFactory {
  static create(): AIProvider {
    const provider = process.env.AI_PROVIDER ?? "mock";

    switch (provider) {
      case "ollama":
        return new OllamaAIProvider();
      case "remote":
        return new OpenAICompatibleAIProvider();
      case "mock":
        return new MockAIProvider();
      default:
        throw new Error(`Unknown AI_PROVIDER: ${provider}`);
    }
  }
}

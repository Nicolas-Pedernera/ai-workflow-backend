import { AIProvider } from "./ai-provider.js";
import { MockAIProvider } from "./mock-ai-provider.js";

export class AIProviderFactory {
  static create(): AIProvider {
    return new MockAIProvider();
  }
}

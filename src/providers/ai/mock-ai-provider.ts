import { AIProvider } from "./ai-provider.js";

export class MockAIProvider implements AIProvider {
  async generate(input: string): Promise<string> {
    return `Mock response for: ${input}`;
  }
}

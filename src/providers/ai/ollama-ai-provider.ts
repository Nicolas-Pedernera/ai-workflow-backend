import { AIProvider } from "./ai-provider.js";

export class OllamaAIProvider implements AIProvider {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(
    baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
    model = process.env.OLLAMA_MODEL ?? "llama3.2"
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generate(input: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        prompt: input,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = (await response.json()) as { response: string };
    return data.response;
  }
}

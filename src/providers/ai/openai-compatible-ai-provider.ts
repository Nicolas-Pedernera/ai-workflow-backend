import { AIProvider } from "./ai-provider.js";

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * Talks to any AI provider that implements the OpenAI-compatible
 * /chat/completions endpoint. This includes OpenAI itself, but also
 * Groq, OpenRouter, DeepSeek, and most hosted inference providers —
 * so switching vendors is a config change, not a code change.
 */
export class OpenAICompatibleAIProvider implements AIProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(
    apiKey = process.env.REMOTE_AI_API_KEY,
    baseUrl = process.env.REMOTE_AI_BASE_URL ?? "https://api.openai.com/v1",
    model = process.env.REMOTE_AI_MODEL ?? "gpt-4o-mini"
  ) {
    if (!apiKey) {
      throw new Error("REMOTE_AI_API_KEY is not configured");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.model = model;
  }

  async generate(input: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: input }]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Remote AI request failed: ${response.status} ${errorBody}`
      );
    }

    const data = (await response.json()) as ChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI provider returned no text content");
    }

    return content;
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { AIProvider } from "./ai-provider.js";

export class AnthropicAIProvider implements AIProvider {
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(
    apiKey = process.env.ANTHROPIC_API_KEY,
    model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6"
  ) {
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generate(input: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: "user", content: input }]
    });

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );

    if (!textBlock) {
      throw new Error("AI provider returned no text content");
    }

    return textBlock.text;
  }
}

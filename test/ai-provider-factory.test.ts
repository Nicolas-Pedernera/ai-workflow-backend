import { afterEach, describe, expect, it } from "vitest";
import { AIProviderFactory } from "../src/providers/ai/ai-provider.factory.js";
import { MockAIProvider } from "../src/providers/ai/mock-ai-provider.js";
import { OllamaAIProvider } from "../src/providers/ai/ollama-ai-provider.js";

describe("AIProviderFactory", () => {
  const originalProvider = process.env.AI_PROVIDER;

  afterEach(() => {
    if (originalProvider === undefined) {
      delete process.env.AI_PROVIDER;
    } else {
      process.env.AI_PROVIDER = originalProvider;
    }
  });

  it("creates MockAIProvider by default", () => {
    delete process.env.AI_PROVIDER;

    const provider = AIProviderFactory.create();

    expect(provider).toBeInstanceOf(MockAIProvider);
  });

  it("creates MockAIProvider when configured explicitly", () => {
    process.env.AI_PROVIDER = "mock";

    const provider = AIProviderFactory.create();

    expect(provider).toBeInstanceOf(MockAIProvider);
  });

  it("creates OllamaAIProvider when configured", () => {
    process.env.AI_PROVIDER = "ollama";

    const provider = AIProviderFactory.create();

    expect(provider).toBeInstanceOf(OllamaAIProvider);
  });

  it("rejects unknown providers", () => {
    process.env.AI_PROVIDER = "unknown";

    expect(() => AIProviderFactory.create()).toThrow(
      "Unknown AI_PROVIDER: unknown"
    );
  });
});

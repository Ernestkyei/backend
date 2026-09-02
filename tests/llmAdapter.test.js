import { describe, it, expect, vi } from "vitest";

// Mock the Google GenAI client to avoid real external API calls and quota issues.
vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: function () {
      this.models = {
        generateContent: async () => ({ text: "mock response from Gemini" }),
      };
    },
  };
});

import { testGeminiConnection } from "../adapters/llm/llmAdapter.js";

describe("Gemini LLM Adapter", () => {
  it("should successfully connect to Gemini", async () => {
    const result = await testGeminiConnection();

    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
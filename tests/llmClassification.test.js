import { describe, it, expect } from "vitest";
import { classifyWithGemini } from "../adapters/llm/llmAdapter.js";

describe("Gemini Email Classification", () => {
  it("should classify a service enquiry", async () => {
    const result = await classifyWithGemini({
      subject: "What services do you provide?",
      body: "I would like to know more about your services."
    });

    console.log("Gemini classification:", result);

    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  }, 15000);
});
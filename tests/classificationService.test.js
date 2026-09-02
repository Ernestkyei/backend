import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("../adapters/llm/llmAdapter.js", () => ({
  classifyWithGemini: vi.fn()
}));

import { classifyWithGemini } from "../adapters/llm/llmAdapter.js";
import { classifyEmail } from "../services/classificationService.js";

describe("Classification Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should classify a service enquiry as IN_REMIT", async () => {
    classifyWithGemini.mockResolvedValue({
      classification: "IN_REMIT",
      confidence: 0.95,
      intent: "service_inquiry",
      reason: "The customer is asking about the organization's services."
    });

    const result = await classifyEmail({
      subject: "What services do you provide?",
      body: "I would like to know more about your services."
    });

    expect(result.classification).toBe("IN_REMIT");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);

    expect(classifyWithGemini).toHaveBeenCalled();
  });

  it("should classify a restricted request as NEEDS_REVIEW", async () => {
    const result = await classifyEmail({
      subject: "I want a refund",
      body: "Please refund my payment."
    });

    expect(result.classification).toBe("NEEDS_REVIEW");
    expect(result.confidence).toBe(1.0);

    expect(classifyWithGemini).not.toHaveBeenCalled();
  });

  it("should classify an unclear email as NEEDS_REVIEW", async () => {
    classifyWithGemini.mockResolvedValue({
      classification: "NEEDS_REVIEW",
      confidence: 0.60,
      intent: "unclear",
      reason: "The email does not contain enough information."
    });

    const result = await classifyEmail({
      subject: "Hello",
      body: "I have something to discuss."
    });

    expect(result.classification).toBe("NEEDS_REVIEW");

    expect(classifyWithGemini).toHaveBeenCalled();
  });
});

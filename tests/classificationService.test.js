import { describe, it, expect } from "vitest";
import { classifyEmail } from "../services/classificationService.js";

describe("Classification Service", () => {
  it("should classify a service enquiry as IN_REMIT", async () => {
    const result = await classifyEmail({
      subject: "What services do you provide?",
      body: "I would like to know more about your services."
    });

    expect(result.classification).toBe("IN_REMIT");
    expect(result.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("should classify a restricted request as NEEDS_REVIEW", async () => {
    const result = await classifyEmail({
      subject: "I want a refund",
      body: "Please refund my payment."
    });

    expect(result.classification).toBe("NEEDS_REVIEW");
  });

  it("should classify an unclear email as NEEDS_REVIEW", async () => {
    const result = await classifyEmail({
      subject: "Hello",
      body: "I have something to discuss."
    });

    expect(result.classification).toBe("NEEDS_REVIEW");
  });
});
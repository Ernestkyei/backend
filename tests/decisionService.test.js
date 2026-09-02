import { describe, it, expect } from "vitest";
import { decideEmailAction } from "../services/decisionService.js";

describe("Decision Service", () => {
  it("should automate a high-confidence IN_REMIT email", () => {
    const result = decideEmailAction({
      classification: "IN_REMIT",
      confidence: 0.95
    });

    expect(result.decision).toBe("AUTOMATE");
  });

  it("should take no action for an OUT_OF_REMIT email", () => {
    const result = decideEmailAction({
      classification: "OUT_OF_REMIT",
      confidence: 0.95
    });

    expect(result.decision).toBe("NO_ACTION");
  });

  it("should escalate a NEEDS_REVIEW email", () => {
    const result = decideEmailAction({
      classification: "NEEDS_REVIEW",
      confidence: 1.0
    });

    expect(result.decision).toBe("ESCALATE");
  });

  it("should escalate a low-confidence IN_REMIT email", () => {
    const result = decideEmailAction({
      classification: "IN_REMIT",
      confidence: 0.70
    });

    expect(result.decision).toBe("ESCALATE");
  });
});
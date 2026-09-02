import { classifyWithGemini } from "../adapters/llm/llmAdapter.js";

const CONFIDENCE_THRESHOLD = 0.85;

export const classifyEmail = async ({
  subject,
  body
}) => {
  const text = `${subject} ${body}`.toLowerCase();

  // Restricted requests always require human review
  if (
    text.includes("refund") ||
    text.includes("password") ||
    text.includes("legal") ||
    text.includes("financial")
  ) {
    return {
      classification: "NEEDS_REVIEW",
      confidence: 1.0,
      intent: "restricted_request",
      reason: "The email contains a request that requires human review."
    };
  }

  // Ask Gemini to classify the email
  const result = await classifyWithGemini({
    subject,
    body
  });

  // Low-confidence classifications require human review
  if (result.confidence < CONFIDENCE_THRESHOLD) {
    return {
      ...result,
      classification: "NEEDS_REVIEW",
      reason: "The AI classification confidence is below the required threshold."
    };
  }

  // High-confidence result from Gemini
  return result;
};
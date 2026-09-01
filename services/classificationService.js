export const classifyEmail = async ({
  subject,
  body
}) => {
  const text = `${subject} ${body}`.toLowerCase();

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

  if (
    text.includes("service") ||
    text.includes("services") ||
    text.includes("how does") ||
    text.includes("get started")
  ) {
    return {
      classification: "IN_REMIT",
      confidence: 0.95,
      intent: "general_information",
      reason: "The email is asking about the organization's services."
    };
  }

  return {
    classification: "NEEDS_REVIEW",
    confidence: 0.5,
    intent: "unclear",
    reason: "The email could not be confidently classified."
  };
};
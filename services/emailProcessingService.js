import { classifyWithGroq } from "../adapters/llm/llmAdapter.js";
import { generateEmailResponse } from "./responseService.js";
import { createClassification } from "../database/model/classificationModal.js";
import { createDecision } from "../database/model/decisionModal.js";
import {
  createResponse,
  updateResponseStatus,
} from "../database/model/responseModal.js";
import { sendGmailMessage } from "./gmailService.js";
import { createReviewCase } from "../database/model/reviewCaseModal.js";
import { createAuditLog } from "../database/model/auditLogModal.js";

export const processEmail = async (email) => {
  // ========================================
  // 1. CLASSIFY EMAIL
  // ========================================

  console.log("Classifying email:", email.subject);

  const classification = await classifyWithGroq({
    subject: email.subject,
    body: email.body,
  });

  console.log("Classification:", classification);

  // ========================================
  // 2. SAVE CLASSIFICATION
  // ========================================

  const savedClassification = await createClassification({
    emailId: email.id,
    classification: classification.classification,
    confidence: classification.confidence,
    intent: classification.intent,
    reason: classification.reason,
  });

  await createAuditLog({
    emailId: email.id,
    event: "CLASSIFIED",
    details: {
      classification: classification.classification,
      confidence: classification.confidence,
      intent: classification.intent,
      reason: classification.reason,
    },
  });

  // ========================================
  // 3. DECIDE ACTION
  // ========================================

  let decision;

  if (
    classification.classification === "IN_REMIT" &&
    classification.confidence >= 0.85
  ) {
    decision = {
      decision: "AUTOMATE",
      reason:
        "The email is within the real estate organization's remit and has sufficient confidence.",
    };
  } else if (classification.classification === "OUT_OF_REMIT") {
    decision = {
      decision: "NO_ACTION",
      reason:
        "The email is outside the real estate organization's remit.",
    };
  } else {
    decision = {
      decision: "ESCALATE",
      reason: "The email requires human review.",
    };
  }

  // ========================================
  // 4. SAVE DECISION
  // ========================================

  const savedDecision = await createDecision({
    emailId: email.id,
    decision: decision.decision,
    reason: decision.reason,
  });

  await createAuditLog({
    emailId: email.id,
    event: "DECISION_MADE",
    details: {
      decision: decision.decision,
      reason: decision.reason,
    },
  });

  // ========================================
  // INITIAL VALUES
  // ========================================

  let generatedResponse = null;
  let savedResponse = null;
  let sentEmail = null;
  let reviewCase = null;
  let clientMessage = "";

  // ========================================
  // 5. AUTOMATE
  // ========================================

  if (decision.decision === "AUTOMATE") {
    console.log("Decision: AUTOMATE");

    generatedResponse = await generateEmailResponse({
      subject: email.subject,
      body: email.body,
      intent: classification.intent,
    });

    await createAuditLog({
      emailId: email.id,
      event: "RESPONSE_GENERATED",
      details: "AI response generated successfully.",
    });

    savedResponse = await createResponse({
      emailId: email.id,
      body: generatedResponse,
      status: "PENDING",
    });

    sentEmail = await sendGmailMessage({
      to: email.sender_email,
      subject: `Re: ${email.subject}`,
      body: generatedResponse,
      threadId: email.thread_id,
    });

    savedResponse = await updateResponseStatus(savedResponse.id, "SENT");

    await createAuditLog({
      emailId: email.id,
      event: "RESPONSE_SENT",
      details: {
        to: email.sender_email,
        gmailMessageId: sentEmail.id,
      },
    });

    clientMessage =
      "The email was classified as within the real estate organization's remit. An AI-generated response was created and successfully sent to the sender.";
  }

  // ========================================
  // 6. ESCALATE
  // ========================================

  if (decision.decision === "ESCALATE") {
    console.log("Decision: ESCALATE");

    reviewCase = await createReviewCase({
      emailId: email.id,
      assignedTo: null,
      status: "OPEN",
      reason: decision.reason,
    });

    await createAuditLog({
      emailId: email.id,
      event: "ESCALATED",
      details: decision.reason,
    });

    clientMessage =
      "This email requires human review. No automated response was sent to the sender. A review case has been created for the administrator.";
  }

  // ========================================
  // 7. NO ACTION
  // ========================================

  if (decision.decision === "NO_ACTION") {
    console.log("Decision: NO_ACTION");

    await createAuditLog({
      emailId: email.id,
      event: "NO_ACTION",
      details: decision.reason,
    });

    clientMessage =
      "This email was classified as outside the real estate organization's remit. No response was sent to the sender. The decision has been recorded in the audit log.";
  }

  // ========================================
  // 8. RETURN RESULT
  // ========================================

  return {
    email: {
      id: email.id,
      messageId: email.message_id,
      senderEmail: email.sender_email,
      senderName: email.sender_name,
      subject: email.subject,
      body: email.body,
    },

    classification: savedClassification,
    decision: savedDecision,
    clientMessage,
    response: savedResponse,
    sentEmail,
    reviewCase,
  };
};
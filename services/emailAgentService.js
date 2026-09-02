
import { saveIncomingEmail } from "./emailService.js";
import { classifyEmail } from "./classificationService.js";
import { decideEmailAction } from "./decisionService.js";
import { generateEmailResponse } from "./responseService.js";

import { createClassification } from "../database/model/classificationModal.js";
import { createDecision } from "../database/model/decisionModal.js";
import { createResponse } from "../database/model/responseModal.js";
import { createReviewCase } from "../database/model/reviewCaseModal.js";
import { createAuditLog } from "../database/model/auditLogModal.js";

export const processIncomingEmail = async ({
  messageId,
  senderEmail,
  senderName,
  subject,
  body,
  receivedAt
}) => {
  // Step 1: Save the incoming email
  const email = await saveIncomingEmail({
    messageId,
    senderEmail,
    senderName,
    subject,
    body,
    receivedAt
  });

  // Record that the email was received
  await createAuditLog({
    emailId: email.id,
    event: "EMAIL_RECEIVED",
    details: {
      messageId: email.message_id
    }
  });

  // Step 2: Classify the email
  const classification = await classifyEmail({
    subject,
    body
  });

  // Step 3: Save the classification
  const savedClassification = await createClassification({
    emailId: email.id,
    classification: classification.classification,
    confidence: classification.confidence,
    intent: classification.intent,
    reason: classification.reason
  });

  // Record the classification
  await createAuditLog({
    emailId: email.id,
    event: "EMAIL_CLASSIFIED",
    details: {
      classification: classification.classification,
      confidence: classification.confidence,
      intent: classification.intent
    }
  });

  // Step 4: Decide what to do with the email
  const decision = decideEmailAction({
    classification: classification.classification,
    confidence: classification.confidence
  });

  // Step 5: Save the decision
  const savedDecision = await createDecision({
    emailId: email.id,
    decision: decision.decision,
    reason: decision.reason
  });

  // Record the decision
  await createAuditLog({
    emailId: email.id,
    event: "DECISION_MADE",
    details: {
      decision: decision.decision,
      reason: decision.reason
    }
  });

  // Step 6: Handle the decision
  let response = null;
  let reviewCase = null;

  // AUTOMATE
  if (decision.decision === "AUTOMATE") {
    // Generate the response
    const generatedResponse = await generateEmailResponse({
      subject,
      body,
      intent: classification.intent
    });

    // Save the generated response
    response = await createResponse({
      emailId: email.id,
      body: generatedResponse,
      status: "PENDING"
    });

    // Record that a response was generated
    await createAuditLog({
      emailId: email.id,
      event: "RESPONSE_GENERATED",
      details: {
        responseId: response.id,
        status: response.status
      }
    });
  }

  // ESCALATE
  if (decision.decision === "ESCALATE") {
    // Create a human review case
    reviewCase = await createReviewCase({
      emailId: email.id,
      assignedTo: null,
      status: "OPEN",
      reason: decision.reason
    });

    // Record that human review is required
    await createAuditLog({
      emailId: email.id,
      event: "HUMAN_REVIEW_REQUIRED",
      details: {
        reviewCaseId: reviewCase.id,
        status: reviewCase.status
      }
    });
  }

  // NO ACTION
  if (decision.decision === "NO_ACTION") {
    await createAuditLog({
      emailId: email.id,
      event: "NO_ACTION_REQUIRED",
      details: {
        reason: decision.reason
      }
    });
  }

  // Step 7: Return the complete result
  return {
    email,
    classification: savedClassification,
    decision: savedDecision,
    response,
    reviewCase
  };
};


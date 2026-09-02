
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock services
vi.mock("../services/emailService.js", () => ({
  saveIncomingEmail: vi.fn()
}));

vi.mock("../services/classificationService.js", () => ({
  classifyEmail: vi.fn()
}));

vi.mock("../services/decisionService.js", () => ({
  decideEmailAction: vi.fn()
}));

vi.mock("../services/responseService.js", () => ({
  generateEmailResponse: vi.fn()
}));

// Mock database models
vi.mock("../database/model/classificationModal.js", () => ({
  createClassification: vi.fn()
}));

vi.mock("../database/model/decisionModal.js", () => ({
  createDecision: vi.fn()
}));

vi.mock("../database/model/responseModal.js", () => ({
  createResponse: vi.fn()
}));

vi.mock("../database/model/reviewCaseModal.js", () => ({
  createReviewCase: vi.fn()
}));

vi.mock("../database/model/auditLogModal.js", () => ({
  createAuditLog: vi.fn()
}));

import { processIncomingEmail } from "../services/emailAgentService.js";

import { saveIncomingEmail } from "../services/emailService.js";
import { classifyEmail } from "../services/classificationService.js";
import { decideEmailAction } from "../services/decisionService.js";
import { generateEmailResponse } from "../services/responseService.js";

import { createClassification } from "../database/model/classificationModal.js";
import { createDecision } from "../database/model/decisionModal.js";
import { createResponse } from "../database/model/responseModal.js";
import { createReviewCase } from "../database/model/reviewCaseModal.js";
import { createAuditLog } from "../database/model/auditLogModal.js";

describe("Email Agent Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    saveIncomingEmail.mockResolvedValue({
      id: "email-123",
      message_id: "message-123",
      sender_email: "customer@example.com",
      subject: "What services do you provide?",
      body: "I would like to know about your services."
    });

    createClassification.mockResolvedValue({
      id: "classification-123"
    });

    createDecision.mockResolvedValue({
      id: "decision-123"
    });

    createResponse.mockResolvedValue({
      id: "response-123",
      status: "PENDING"
    });

    createReviewCase.mockResolvedValue({
      id: "review-123",
      status: "OPEN"
    });

    createAuditLog.mockResolvedValue({
      id: "audit-123"
    });
  });

  it("should automate an IN_REMIT email", async () => {
    classifyEmail.mockResolvedValue({
      classification: "IN_REMIT",
      confidence: 0.95,
      intent: "general_information",
      reason: "The customer is asking about the organization's services."
    });

    decideEmailAction.mockReturnValue({
      decision: "AUTOMATE",
      reason: "The email is within remit and has sufficient confidence."
    });

    generateEmailResponse.mockResolvedValue(
      "Thank you for contacting us. We would be happy to help you with our services."
    );

    const result = await processIncomingEmail({
      messageId: "message-123",
      senderEmail: "customer@example.com",
      senderName: "John",
      subject: "What services do you provide?",
      body: "I would like to know about your services.",
      receivedAt: new Date()
    });

    expect(result.email).toBeTruthy();
    expect(result.classification).toBeTruthy();
    expect(result.decision).toBeTruthy();
    expect(result.response).toBeTruthy();

    expect(saveIncomingEmail).toHaveBeenCalled();
    expect(classifyEmail).toHaveBeenCalled();
    expect(decideEmailAction).toHaveBeenCalled();
    expect(generateEmailResponse).toHaveBeenCalled();
    expect(createResponse).toHaveBeenCalled();

    expect(createReviewCase).not.toHaveBeenCalled();
  });

  it("should escalate a NEEDS_REVIEW email", async () => {
    classifyEmail.mockResolvedValue({
      classification: "NEEDS_REVIEW",
      confidence: 1.0,
      intent: "restricted_request",
      reason: "The request requires human review."
    });

    decideEmailAction.mockReturnValue({
      decision: "ESCALATE",
      reason: "The email requires human review."
    });

    const result = await processIncomingEmail({
      messageId: "message-456",
      senderEmail: "customer@example.com",
      senderName: "Jane",
      subject: "I need help with my account",
      body: "Please assist me with this request.",
      receivedAt: new Date()
    });

    expect(result.email).toBeTruthy();
    expect(result.classification).toBeTruthy();
    expect(result.decision).toBeTruthy();
    expect(result.reviewCase).toBeTruthy();

    expect(createReviewCase).toHaveBeenCalled();

    expect(generateEmailResponse).not.toHaveBeenCalled();
    expect(createResponse).not.toHaveBeenCalled();
  });

  it("should take no action for an OUT_OF_REMIT email", async () => {
    classifyEmail.mockResolvedValue({
      classification: "OUT_OF_REMIT",
      confidence: 0.95,
      intent: "unrelated_request",
      reason: "The email is unrelated to the organization's services."
    });

    decideEmailAction.mockReturnValue({
      decision: "NO_ACTION",
      reason: "The email is outside the organization's remit."
    });

    const result = await processIncomingEmail({
      messageId: "message-789",
      senderEmail: "customer@example.com",
      senderName: "Michael",
      subject: "Recommend a restaurant",
      body: "Can you recommend a good restaurant?",
      receivedAt: new Date()
    });

    expect(result.email).toBeTruthy();
    expect(result.classification).toBeTruthy();
    expect(result.decision).toBeTruthy();

    expect(createResponse).not.toHaveBeenCalled();
    expect(createReviewCase).not.toHaveBeenCalled();
    expect(generateEmailResponse).not.toHaveBeenCalled();
  });
});


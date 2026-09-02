
import { GoogleGenAI } from "@google/genai";
import { classificationSchema } from "../../domain/classificationSchema.js";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Test Gemini connection
export const testGeminiConnection = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Say hello in one short sentence."
  });

  return response.text;
};

// Classify incoming email
export const classifyWithGemini = async ({ subject, body }) => {
  const prompt = `
You are an email classification assistant.

Classify the following customer email into exactly one of these categories:

IN_REMIT
OUT_OF_REMIT
NEEDS_REVIEW

Use these rules:

- IN_REMIT: The email is related to the organization's services or general information.
- OUT_OF_REMIT: The email is unrelated to the organization's services.
- NEEDS_REVIEW: The email is unclear, sensitive, or requires human attention.

Return ONLY valid JSON in this exact structure:

{
  "classification": "IN_REMIT",
  "confidence": 0.95,
  "intent": "general_information",
  "reason": "The customer is asking about the organization's services."
}

Email subject:
${subject}

Email body:
${body}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt
  });

  const text = response.text.trim();

  let parsedResult;

  try {
    parsedResult = JSON.parse(text);
  } catch (error) {
    throw new Error("Gemini returned invalid JSON.");
  }

  const validatedResult = classificationSchema.safeParse(parsedResult);

  if (!validatedResult.success) {
    throw new Error("Gemini returned an invalid classification.");
  }

  return validatedResult.data;
};

// Generate customer email response
export const generateResponseWithGemini = async ({
  subject,
  body,
  intent
}) => {
  const prompt = `
You are a professional customer service email assistant.

Write a clear, polite, and helpful response to the customer.

Rules:
- Be professional and concise.
- Answer based only on the information provided.
- Do not invent prices, policies, services, or promises.
- Do not make decisions about refunds, legal matters, financial matters, or sensitive issues.
- If the information is not available, politely state that a human representative will assist the customer.
- Return ONLY the email response.
- Do not include a subject line.
- Do not return JSON.

Customer email subject:
${subject}

Customer email body:
${body}

Customer intent:
${intent}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt
  });

  return response.text.trim();
};


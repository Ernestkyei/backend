import { GoogleGenAI } from "@google/genai";
import { classificationSchema } from "../../domain/classificationSchema.js";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const testGeminiConnection = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Say hello in one short sentence."
  });

  return response.text;
};

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

  return response.text;
};
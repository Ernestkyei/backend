import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash"
});

export const classifyEmail = async ({ subject, body }) => {

  const prompt = `
You are an email classification assistant.

Your job is to determine whether an email is within the organization's remit.

Classify the email as exactly one of:
IN_REMIT
OUT_OF_REMIT

Email subject:
${subject}

Email body:
${body}

Return ONLY valid JSON in this exact format:

{
  "classification": "IN_REMIT",
  "reason": "Short explanation"
}
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedResponse);
};
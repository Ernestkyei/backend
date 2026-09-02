import { generateResponseWithGemini } from "../adapters/llm/llmAdapter.js";

export const generateEmailResponse = async ({
  subject,
  body,
  intent
}) => {
  const response = await generateResponseWithGemini({
    subject,
    body,
    intent
  });

  return response;
};


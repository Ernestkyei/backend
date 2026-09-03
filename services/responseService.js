import {
  generateResponseWithGroq
} from "../adapters/llm/llmAdapter.js";


// ========================================
// Generate email response
// ========================================

export const generateEmailResponse = async ({
  subject,
  body,
  intent
}) => {

  const response =
    await generateResponseWithGroq({
      subject,
      body,
      intent
    });

  return response;

};


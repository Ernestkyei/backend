import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

console.log(
  "DeepSeek API key loaded:",
  process.env.DEEPSEEK_API_KEY ? "YES" : "NO"
);

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

try {
  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: "Say hello in one short sentence."
      }
    ]
  });

  console.log("DeepSeek response:");
  console.log(response.choices[0].message.content);

} catch (error) {
  console.error("DeepSeek test failed:");
  console.error(error.message);
}
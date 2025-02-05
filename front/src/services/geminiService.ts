import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCOG_RW9TXFyN9WVh6us2s6DGXfjg9BdyI";

const genAI = new GoogleGenerativeAI(apiKey);

export const generatePostContent = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(`Please write a social media post based on the following prompt. The post should be concise and limited to a maximum of 3 lines:\n\n${prompt}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

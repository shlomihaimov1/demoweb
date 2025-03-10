import { GoogleGenerativeAI } from '@google/generative-ai';

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY as string; // TypeScript type assertion to ensure this is a string

const genAI = new GoogleGenerativeAI(apiKey);

export const generatePostContent = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(
      `Please write a social media post based on the following prompt. add emojis. The post should be concise and limited to a maximum of 3 lines:\n\n${prompt}`
    );

    const response = result.response;

    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

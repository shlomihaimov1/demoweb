import express, { Request, Response } from 'express';
import { generatePostContent } from '../services/geminiService';

const router = express.Router();

// Define the request body type
interface GeneratePostRequest {
  prompt: string;
}

router.post('/generate-post', async (req: Request, res: Response) => {
  try {
    const { prompt }: GeneratePostRequest = req.body;
    const content = await generatePostContent(prompt);
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});

export default router;

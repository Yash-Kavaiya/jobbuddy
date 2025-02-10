import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface QuestionCategory {
  type: 'behavioral' | 'technical' | 'situational';
  questions: Array<{
    question: string;
    hint?: string;
  }>;
}

export async function generateInterviewQuestions(
  jobDescription: string,
  category: string
): Promise<QuestionCategory[]> {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze this job description and generate interview questions:
    "${jobDescription}"
    
    Job Category: ${category}
    
    Please generate interview questions in the following JSON format (return only the JSON, no markdown formatting or backticks):
    {
      "questions": [
        {
          "type": "technical",
          "questions": [{"question": "...", "hint": "..."}]
        },
        {
          "type": "behavioral",
          "questions": [{"question": "...", "hint": "..."}]
        },
        {
          "type": "situational",
          "questions": [{"question": "...", "hint": "..."}]
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error('Invalid response from Gemini API');
    }

    const response = await result.response.text();
    
    // Clean up the response by removing markdown formatting
    const cleanJson = response.replace(/```json\n|\n```/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanJson);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid response format from API');
      }
      return parsed.questions;
    } catch (parseError) {
      console.error('Error parsing API response:', response);
      throw new Error('Failed to parse API response');
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error instanceof Error ? error : new Error('Failed to generate interview questions');
  }
}

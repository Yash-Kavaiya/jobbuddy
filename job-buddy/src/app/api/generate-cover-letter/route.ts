import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resume = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description are required', details: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    if (!model) {
      return NextResponse.json(
        { error: 'AI model initialization failed', details: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const prompt = `
      Generate a professional cover letter based on this job description:
      "${jobDescription}"
      
      The cover letter should be:
      1. Professional and engaging
      2. Highlight relevant skills and experience
      3. Show enthusiasm for the role
      4. Be concise (max 400 words)
    `;

    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      return NextResponse.json(
        { error: 'Failed to generate content', details: 'No response from AI model' },
        { status: 500 }
      );
    }

    const coverLetter = await result.response.text();

    return NextResponse.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate cover letter', 
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { jobDescription } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
    const coverLetter = await result.response.text();

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}

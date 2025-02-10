import { NextResponse } from 'next/server';
import { generateStudyPlan } from '@/utils/studyPlanGenerator';
import { StudyPlanData } from '@/utils/studyPlanGenerator';

export async function POST(request: Request) {
  try {
    let body: StudyPlanData;
    
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Validate input
    if (!body.goals?.trim() || !body.jobDescription?.trim()) {
      return NextResponse.json(
        { error: 'Goals and job description are required' },
        { status: 400 }
      );
    }

    try {
      const studyPlan = await generateStudyPlan(body);
      return NextResponse.json(studyPlan);
    } catch (genError) {
      console.error('Generation error:', genError);
      return NextResponse.json(
        { 
          error: genError instanceof Error ? genError.message : 'Failed to generate study plan',
          details: process.env.NODE_ENV === 'development' ? String(genError) : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
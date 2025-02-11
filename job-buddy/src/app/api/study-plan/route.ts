import { NextResponse } from 'next/server';
import { generateStudyPlan, validateStudyPlan } from '@/utils/studyPlanGenerator';
import { StudyPlanInput } from '@/types/study-plan';

export async function POST(request: Request) {
  try {
    const input: StudyPlanInput = await request.json();

    // Validate input
    if (!input.goals?.trim() || !input.jobDescription?.trim()) {
      return NextResponse.json(
        { error: 'Goals and job description are required' },
        { status: 400 }
      );
    }

    const studyPlan = await generateStudyPlan(input);

    if (!validateStudyPlan(studyPlan)) {
      return NextResponse.json(
        { error: 'Invalid study plan structure generated' },
        { status: 500 }
      );
    }

    return NextResponse.json(studyPlan);
  } catch (error) {
    console.error('Study plan generation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate study plan',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
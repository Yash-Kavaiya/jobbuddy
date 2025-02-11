import { GoogleGenerativeAI } from "@google/generative-ai";
import { StudyPlanData, StudyPlanInput } from '@/types/study-plan';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY!);

export interface StudyPlanData {
  goals: string;
  jobDescription: string;
  availableTime: string;
  topics: string;
  learningStyle: string;
  currentLevel: string;
}

export interface StudyPlan {
  weeklySchedule: Array<{
    week: number;
    topics: string[];
    resources: Array<{
      type: string;
      links: string[];
      description: string;
    }>;
    objectives: string[];
    assessments: string[];
  }>;
  estimatedCompletionTime: string;
  prerequisites: string[];
  additionalResources: string[];
}

export async function generateStudyPlan(input: StudyPlanInput): Promise<StudyPlanData> {
  try {
    // This is a mock implementation. Replace with your actual AI/API call
    const mockPlan: StudyPlanData = {
      weeklySchedule: [
        {
          week: 1,
          topics: [
            "Introduction to the basics",
            "Setting up development environment",
            "Core concepts overview"
          ]
        },
        {
          week: 2,
          topics: [
            "Advanced topics",
            "Best practices",
            "Practical exercises"
          ]
        }
      ],
      estimatedCompletionTime: "2 weeks",
      prerequisites: [
        "Basic programming knowledge",
        "Understanding of core concepts"
      ],
      additionalResources: [
        "Online documentation",
        "Practice exercises",
        "Community resources"
      ]
    };

    return mockPlan;
  } catch (error) {
    console.error('Study plan generation error:', error);
    throw new Error('Failed to generate study plan');
  }
}

export function validateStudyPlan(plan: any): plan is StudyPlanData {
  if (!plan || typeof plan !== 'object') return false;
  
  const hasValidStructure = 'weeklySchedule' in plan &&
    'estimatedCompletionTime' in plan &&
    'prerequisites' in plan &&
    'additionalResources' in plan;

  if (!hasValidStructure) return false;

  const hasValidWeeklySchedule = Array.isArray(plan.weeklySchedule) &&
    plan.weeklySchedule.every((week: any) =>
      week &&
      typeof week.week === 'number' &&
      Array.isArray(week.topics)
    );

  return hasValidWeeklySchedule;
}

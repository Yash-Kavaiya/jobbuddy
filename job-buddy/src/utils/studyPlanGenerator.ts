import { GoogleGenerativeAI } from "@google/generative-ai";

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

export async function generateStudyPlan(data: StudyPlanData): Promise<StudyPlan> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are a study plan generator. Create a structured learning plan based on these requirements:

Career Goals: ${data.goals}
Job Description: ${data.jobDescription}
Available Time: ${data.availableTime}
Topics: ${data.topics}
Learning Style: ${data.learningStyle}
Current Level: ${data.currentLevel}

Return ONLY a JSON object with this exact structure (no additional text or explanation):
{
  "weeklySchedule": [
    {
      "week": 1,
      "topics": ["specific topic 1", "specific topic 2"],
      "resources": [
        {
          "type": "video",
          "links": ["https://example.com/resource1"],
          "description": "Brief description of resource"
        }
      ],
      "objectives": ["Clear objective 1", "Clear objective 2"],
      "assessments": ["Specific assessment 1", "Specific assessment 2"]
    }
  ],
  "estimatedCompletionTime": "X weeks",
  "prerequisites": ["prerequisite 1", "prerequisite 2"],
  "additionalResources": ["resource 1", "resource 2"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Raw response:', response);
      throw new Error('No valid JSON found in response');
    }

    const cleanJson = jsonMatch[0].trim();
    
    try {
      const parsed = JSON.parse(cleanJson);
      
      // Validate the structure
      const isValid = (
        Array.isArray(parsed.weeklySchedule) &&
        parsed.weeklySchedule.length > 0 &&
        parsed.weeklySchedule.every((week: any) => (
          typeof week.week === 'number' &&
          Array.isArray(week.topics) &&
          Array.isArray(week.resources) &&
          Array.isArray(week.objectives) &&
          Array.isArray(week.assessments)
        )) &&
        typeof parsed.estimatedCompletionTime === 'string' &&
        Array.isArray(parsed.prerequisites) &&
        Array.isArray(parsed.additionalResources)
      );

      if (!isValid) {
        throw new Error('Invalid study plan structure');
      }

      return parsed;
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Clean JSON:', cleanJson);
      throw new Error('Failed to parse study plan format');
    }
  } catch (error) {
    console.error('Generation error:', error);
    throw new Error(
      error instanceof Error 
        ? `Study plan generation failed: ${error.message}`
        : 'Failed to generate study plan'
    );
  }
}

export interface StudyPlanWeek {
  week: number;
  topics: string[];
  activities?: string[];
  resources?: string[];
}

export interface StudyPlanData {
  weeklySchedule: StudyPlanWeek[];
  estimatedCompletionTime: string;
  prerequisites: string[];
  additionalResources: string[];
}

export interface StudyPlanInput {
  goals: string;
  jobDescription: string;
  availableTime: string;
  topics: string;
  learningStyle: string;
  currentLevel: string;
}

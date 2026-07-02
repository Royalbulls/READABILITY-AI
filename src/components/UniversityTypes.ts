export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  title: string;
  content: string;
  visualExplanation?: string;
  keyPoints?: string[];
}

export interface Chapter {
  title: string;
  lessons: Lesson[];
}

export interface LevelData {
  overview: string;
  objectives: string[];
  prerequisites: string;
  roadmap: string;
  chapters: Chapter[];
  caseStudies?: string;
  flashcards?: Array<{ term: string; definition: string }>;
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  studyHours: number;
  rating?: number;
  language: "English" | "Hindi" | "Multilingual";
  level: "Beginner" | "Intermediate" | "Advanced" | "Professional";
  beginner: LevelData;
  intermediate: LevelData;
  advanced: LevelData;
  expert: LevelData;
  completionStatus?: number;
}

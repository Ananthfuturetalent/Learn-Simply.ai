
export interface User {
  email: string;
  isAdmin?: boolean;
}

// For Dictionary and Vocabulary
export interface WordDefinition {
    word: string;
    pronunciation: string;
    meaning: string;
    examples: string[];
}

export interface VocabularyWord extends WordDefinition {
    dateAdded: string; // ISO string
}


// For "My Learning" / History
export interface ConceptHistory {
  title: string;
  notes?: string;
}

export interface LearningTopic {
  topic: string;
  date: string; // ISO string
  concepts: Record<string, ConceptHistory>; // Keyed by concept title
}


// For Roadmap Generation
export interface RoadmapItem {
  title: string;
}

export type Roadmap = RoadmapItem[];

// For Detailed Concept View
export interface YoutubeVideo {
  title: string;
  videoId: string;
}

export interface DetailedConcept {
  explanation: string;
  synopsis: string;
  youtubeVideos: YoutubeVideo[];
  resourceSearchQueries:string[];
}

// For Quote of the day
export interface DailyQuote {
  quote: string;
  author: string;
}

// For Quiz Generation
export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string; // The correct answer string, must be one of the options
}

export type Quiz = QuizQuestion[];
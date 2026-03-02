// Game Types for SwipeUp AI Quest

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'scenario' | 'matching' | 'prompt-exercise';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xpValue: number;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'interactive' | 'scenario' | 'exercise';
  interactiveComponent?: string;
  keyPoints?: string[];
  example?: string;
}

export interface Mission {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  learningObjectives: string[];
  sections: ContentSection[];
  quiz: QuizQuestion[];
  xpReward: number;
  icon: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ScenarioChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  points: number;
}

export interface Scenario {
  id: string;
  title: string;
  context: string;
  question: string;
  choices: ScenarioChoice[];
}

export interface PromptExercise {
  id: string;
  scenario: string;
  task: string;
  sampleAnswer: string;
  criteria: string[];
}

export interface PlayerProgress {
  currentMission: number;
  currentSection: number;
  completedMissions: number[];
  xp: number;
  quizScores: Record<number, number>;
  unlockedMissions: number[];
  playerName: string;
  completedAt?: string;
}

export interface GameState {
  progress: PlayerProgress;
  currentView: 'welcome' | 'mission-select' | 'mission' | 'quiz' | 'results' | 'certificate';
  activeMission: Mission | null;
  activeQuizQuestion: number;
  quizAnswers: Record<string, string | number>;
  showFeedback: boolean;
  lastAnswerCorrect: boolean;
}

export type GameAction =
  | { type: 'START_GAME'; playerName: string }
  | { type: 'SELECT_MISSION'; missionId: number }
  | { type: 'COMPLETE_SECTION' }
  | { type: 'ANSWER_QUIZ'; questionId: string; answer: string | number }
  | { type: 'COMPLETE_MISSION'; score: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'VIEW_RESULTS' }
  | { type: 'RETURN_TO_MAP' }
  | { type: 'CLAIM_CERTIFICATE' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_PROGRESS'; progress: PlayerProgress };

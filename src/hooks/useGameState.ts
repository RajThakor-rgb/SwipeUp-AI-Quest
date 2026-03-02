'use client';

import { useState, useCallback, useEffect } from 'react';
import { PlayerProgress, GameState, Mission } from '@/types/game';

const STORAGE_KEY = 'swipeup-ai-quest-progress';

const defaultProgress: PlayerProgress = {
  currentMission: 0,
  currentSection: 0,
  completedMissions: [],
  xp: 0,
  quizScores: {},
  unlockedMissions: [1],
  playerName: '',
};

const initialState: GameState = {
  progress: defaultProgress,
  currentView: 'welcome',
  activeMission: null,
  activeQuizQuestion: 0,
  quizAnswers: {},
  showFeedback: false,
  lastAnswerCorrect: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved) as PlayerProgress;
        setState(prev => ({
          ...prev,
          progress: parsedProgress,
          currentView: parsedProgress.playerName ? 'mission-select' : 'welcome',
        }));
      } catch {
        console.error('Failed to parse saved progress');
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback((progress: PlayerProgress) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, []);

  const startGame = useCallback((playerName: string) => {
    setState(prev => {
      const newProgress = {
        ...prev.progress,
        playerName,
      };
      saveProgress(newProgress);
      return {
        ...prev,
        progress: newProgress,
        currentView: 'mission-select',
      };
    });
  }, [saveProgress]);

  const selectMission = useCallback((mission: Mission) => {
    setState(prev => ({
      ...prev,
      currentView: 'mission',
      activeMission: mission,
      currentSection: 0,
      activeQuizQuestion: 0,
      quizAnswers: {},
      showFeedback: false,
    }));
  }, []);

  const completeSection = useCallback(() => {
    setState(prev => {
      if (!prev.activeMission) return prev;
      
      const nextSection = prev.progress.currentSection + 1;
      const totalSections = prev.activeMission.sections.length;

      if (nextSection >= totalSections) {
        // Move to quiz
        return {
          ...prev,
          currentView: 'quiz',
          progress: {
            ...prev.progress,
            currentSection: nextSection,
          },
        };
      }

      const newProgress = {
        ...prev.progress,
        currentSection: nextSection,
      };
      saveProgress(newProgress);

      return {
        ...prev,
        progress: newProgress,
      };
    });
  }, [saveProgress]);

  const answerQuiz = useCallback((questionId: string, answer: string | number) => {
    setState(prev => {
      const newAnswers = { ...prev.quizAnswers, [questionId]: answer };
      return {
        ...prev,
        quizAnswers: newAnswers,
        showFeedback: true,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (!prev.activeMission) return prev;
      
      const totalQuestions = prev.activeMission.quiz.length;
      const nextQ = prev.activeQuizQuestion + 1;

      if (nextQ >= totalQuestions) {
        // Calculate score
        let correctCount = 0;
        let earnedXP = 0;

        prev.activeMission.quiz.forEach((q) => {
          const userAnswer = prev.quizAnswers[q.id];
          if (userAnswer === q.correctAnswer) {
            correctCount++;
            earnedXP += q.xpValue;
          }
        });

        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= 80;

        const newCompletedMissions = passed && !prev.progress.completedMissions.includes(prev.activeMission.id)
          ? [...prev.progress.completedMissions, prev.activeMission.id]
          : prev.progress.completedMissions;

        // Unlock next mission if passed
        let newUnlockedMissions = [...prev.progress.unlockedMissions];
        if (passed && prev.activeMission.id < 6) {
          const nextMissionId = prev.activeMission.id + 1;
          if (!newUnlockedMissions.includes(nextMissionId)) {
            newUnlockedMissions.push(nextMissionId);
          }
        }

        const newProgress: PlayerProgress = {
          ...prev.progress,
          xp: prev.progress.xp + earnedXP,
          completedMissions: newCompletedMissions,
          unlockedMissions: newUnlockedMissions,
          quizScores: {
            ...prev.progress.quizScores,
            [prev.activeMission.id]: score,
          },
          completedAt: passed && newCompletedMissions.length === 6 
            ? new Date().toISOString() 
            : prev.progress.completedAt,
        };
        
        saveProgress(newProgress);

        return {
          ...prev,
          currentView: 'results',
          progress: newProgress,
        };
      }

      return {
        ...prev,
        activeQuizQuestion: nextQ,
        showFeedback: false,
      };
    });
  }, [saveProgress]);

  const returnToMap = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentView: 'mission-select',
      activeMission: null,
      activeQuizQuestion: 0,
      quizAnswers: {},
      showFeedback: false,
      progress: {
        ...prev.progress,
        currentSection: 0,
        currentMission: 0,
      },
    }));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      ...initialState,
      progress: defaultProgress,
    });
  }, []);

  const checkAnswer = useCallback((questionId: string): boolean => {
    if (!state.activeMission) return false;
    const question = state.activeMission.quiz.find(q => q.id === questionId);
    if (!question) return false;
    return state.quizAnswers[questionId] === question.correctAnswer;
  }, [state.activeMission, state.quizAnswers]);

  const getCurrentScore = useCallback((): { correct: number; total: number; percentage: number } => {
    if (!state.activeMission) return { correct: 0, total: 0, percentage: 0 };
    
    let correct = 0;
    const total = state.activeMission.quiz.length;
    
    state.activeMission.quiz.forEach((q) => {
      if (state.quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    return {
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
    };
  }, [state.activeMission, state.quizAnswers]);

  const isGameComplete = useCallback((): boolean => {
    return state.progress.completedMissions.length === 6;
  }, [state.progress.completedMissions]);

  return {
    state,
    startGame,
    selectMission,
    completeSection,
    answerQuiz,
    nextQuestion,
    returnToMap,
    resetGame,
    checkAnswer,
    getCurrentScore,
    isGameComplete,
  };
}

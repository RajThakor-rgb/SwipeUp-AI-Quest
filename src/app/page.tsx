'use client';

import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { missions } from '@/data/missions';
import { 
  GameHeader, 
  MissionCard, 
  ContentSection, 
  Quiz, 
  Results, 
  Certificate,
  XPBadge,
  GameProgressBar,
} from '@/components/game/GameComponents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Welcome Screen Component
function WelcomeScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="relative max-w-lg w-full bg-slate-900/90 border-slate-700 backdrop-blur">
        <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8 px-4 sm:px-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img 
              src="/SwipeUp-AI-Quest/swipeup-logo.jpeg" 
              alt="SwipeUp AI Society" 
              className="h-20 sm:h-28 w-auto object-contain rounded-xl shadow-lg shadow-teal-500/20"
            />
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              SwipeUp AI Quest
            </h1>
            <p className="text-teal-400 font-medium mb-2 text-sm sm:text-base">
              AI Literacy for Business Students
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Master AI fundamentals, tools, ethics, and practical business applications 
              through interactive missions designed for future business leaders.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-teal-400">6</p>
              <p className="text-xs text-slate-400">Missions</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-amber-400">1200+</p>
              <p className="text-xs text-slate-400">XP to Earn</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-slate-800/50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-cyan-400">Certificate</p>
              <p className="text-xs text-slate-400">Upon Completion</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-slate-400 mb-2">
                Enter your name to begin
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 text-sm sm:text-base"
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && onStart(name.trim())}
              />
            </div>

            <Button
              onClick={() => name.trim() && onStart(name.trim())}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base"
            >
              Start Your Journey
            </Button>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center mb-3 sm:mb-4">What you'll learn:</p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
              {[
                '🧠 AI Fundamentals',
                '🛠️ AI Tools',
                '✍️ Prompt Engineering',
                '⚖️ AI Ethics',
                '📋 Business Applications',
                '🏆 Final Challenge',
              ].map((item, i) => (
                <div key={i} className="text-slate-400 text-center py-1">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mission Select Screen Component
function MissionSelectScreen({
  playerName,
  xp,
  completedMissions,
  unlockedMissions,
  quizScores,
  onSelectMission,
  isComplete,
  completedAt,
}: {
  playerName: string;
  xp: number;
  completedMissions: number[];
  unlockedMissions: number[];
  quizScores: Record<number, number>;
  onSelectMission: (missionId: number) => void;
  isComplete: boolean;
  completedAt?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
      <GameHeader 
        playerName={playerName} 
        xp={xp} 
        missionsCompleted={completedMissions.length}
      />
      
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Welcome back, {playerName}!
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {isComplete 
              ? '🎉 Congratulations! You have completed all missions!'
              : 'Select a mission to continue your AI learning journey.'
            }
          </p>
        </div>

        {isComplete && completedAt && (
          <div className="mb-6 sm:mb-8">
            <Certificate 
              playerName={playerName}
              xp={xp}
              completedAt={completedAt}
            />
          </div>
        )}

        <Card className="bg-slate-900/80 border-slate-700 mb-4 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-white">Overall Progress</h3>
              <XPBadge xp={xp} />
            </div>
            <GameProgressBar 
              value={completedMissions.length} 
              max={6} 
              label="Missions Completed"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              isUnlocked={unlockedMissions.includes(mission.id)}
              isCompleted={completedMissions.includes(mission.id)}
              score={quizScores[mission.id]}
              onClick={() => onSelectMission(mission.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

// Mission Screen Component
function MissionScreen({
  mission,
  currentSection,
  onCompleteSection,
  onPreviousSection,
  onExitMission,
}: {
  mission: typeof missions[0];
  currentSection: number;
  onCompleteSection: () => void;
  onPreviousSection: () => void;
  onExitMission: () => void;
}) {
  const section = mission.sections[currentSection];

  if (!section) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
      <GameHeader 
        playerName="" 
        xp={0} 
        missionsCompleted={0}
        showBackButton={true}
        onBackToMissions={onExitMission}
      />
      
      <main className="px-4 py-8">
        <ContentSection
          section={section}
          onContinue={onCompleteSection}
          onBack={onPreviousSection}
          currentSection={currentSection}
          totalSections={mission.sections.length}
        />
      </main>
    </div>
  );
}

// Quiz Screen Component
function QuizScreen({
  mission,
  activeQuestion,
  quizAnswers,
  showFeedback,
  onAnswer,
  onNext,
  onExitMission,
}: {
  mission: typeof missions[0];
  activeQuestion: number;
  quizAnswers: Record<string, string | number>;
  showFeedback: boolean;
  onAnswer: (answer: string | number) => void;
  onNext: () => void;
  onExitMission: () => void;
}) {
  const question = mission.quiz[activeQuestion];
  const selectedAnswer = quizAnswers[question.id];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
      <GameHeader 
        playerName="" 
        xp={0} 
        missionsCompleted={0}
        showBackButton={true}
        onBackToMissions={onExitMission}
      />
      
      <main className="px-4 py-8">
        <div className="max-w-xl mx-auto mb-6">
          <h2 className="text-xl font-bold text-white text-center">
            {mission.title} - Quiz
          </h2>
        </div>
        <Quiz
          question={question}
          questionNumber={activeQuestion}
          totalQuestions={mission.quiz.length}
          selectedAnswer={selectedAnswer ?? null}
          showFeedback={showFeedback}
          onSelectAnswer={onAnswer}
          onNext={onNext}
          isCorrect={isCorrect}
        />
      </main>
    </div>
  );
}

// Results Screen Component
function ResultsScreen({
  mission,
  quizAnswers,
  onReturnToMap,
  onRetry,
}: {
  mission: typeof missions[0];
  quizAnswers: Record<string, string | number>;
  onReturnToMap: () => void;
  onRetry: () => void;
}) {
  let correct = 0;
  let earnedXP = 0;

  mission.quiz.forEach((q) => {
    if (quizAnswers[q.id] === q.correctAnswer) {
      correct++;
      earnedXP += q.xpValue;
    }
  });

  const score = Math.round((correct / mission.quiz.length) * 100);
  const passed = score >= 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950">
      <GameHeader 
        playerName="" 
        xp={0} 
        missionsCompleted={0}
      />
      
      <main className="px-4 py-8">
        <Results
          mission={mission}
          score={score}
          earnedXP={earnedXP}
          passed={passed}
          onReturnToMap={onReturnToMap}
          onRetry={onRetry}
        />
      </main>
    </div>
  );
}

// Main Game Component
export default function Home() {
  const {
    state,
    startGame,
    selectMission,
    completeSection,
    previousSection,
    answerQuiz,
    nextQuestion,
    returnToMap,
    resetGame,
  } = useGameState();

  const { progress, currentView, activeMission, activeQuizQuestion, quizAnswers, showFeedback } = state;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [progress.currentSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeQuizQuestion]);

  const handleSelectMission = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      selectMission(mission);
    }
  };

  const handleRetry = () => {
    if (activeMission) {
      selectMission(activeMission);
    }
  };

  switch (currentView) {
    case 'welcome':
      return <WelcomeScreen onStart={startGame} />;

    case 'mission-select':
      return (
        <MissionSelectScreen
          playerName={progress.playerName}
          xp={progress.xp}
          completedMissions={progress.completedMissions}
          unlockedMissions={progress.unlockedMissions}
          quizScores={progress.quizScores}
          onSelectMission={handleSelectMission}
          isComplete={progress.completedMissions.length === 6}
          completedAt={progress.completedAt}
        />
      );

    case 'mission':
      if (!activeMission) return null;
      return (
        <MissionScreen
          mission={activeMission}
          currentSection={progress.currentSection}
          onCompleteSection={completeSection}
          onPreviousSection={previousSection}
          onExitMission={returnToMap}
        />
      );

    case 'quiz':
      if (!activeMission) return null;
      return (
        <QuizScreen
          mission={activeMission}
          activeQuestion={activeQuizQuestion}
          quizAnswers={quizAnswers}
          showFeedback={showFeedback}
          onAnswer={(answer) => answerQuiz(activeMission.quiz[activeQuizQuestion].id, answer)}
          onNext={nextQuestion}
          onExitMission={returnToMap}
        />
      );

    case 'results':
      if (!activeMission) return null;
      return (
        <ResultsScreen
          mission={activeMission}
          quizAnswers={quizAnswers}
          onReturnToMap={returnToMap}
          onRetry={handleRetry}
        />
      );

    default:
      return <WelcomeScreen onStart={startGame} />;
  }
}

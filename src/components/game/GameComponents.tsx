'use client';

import React from 'react';
import { Mission, QuizQuestion, PlayerProgress } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// XP Badge Component
export function XPBadge({ xp, size = 'default' }: { xp: number; size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
    lg: 'text-lg px-4 py-2',
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg',
      sizeClasses[size]
    )}>
      <span>⚡</span>
      <span>{xp.toLocaleString()} XP</span>
    </div>
  );
}

// Progress Bar Component
export function GameProgressBar({ 
  value, 
  max, 
  label,
  showPercentage = true 
}: { 
  value: number; 
  max: number; 
  label?: string;
  showPercentage?: boolean;
}) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between text-sm text-slate-400">
          <span>{label}</span>
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <Progress value={percentage} className="h-3 bg-slate-800" />
    </div>
  );
}

// Mission Card Component
export function MissionCard({
  mission,
  isUnlocked,
  isCompleted,
  score,
  onClick,
}: {
  mission: Mission;
  isUnlocked: boolean;
  isCompleted: boolean;
  score?: number;
  onClick: () => void;
}) {
  const difficultyColors = {
    Beginner: 'from-green-500 to-emerald-600',
    Intermediate: 'from-yellow-500 to-orange-500',
    Advanced: 'from-red-500 to-rose-600',
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 cursor-pointer',
        isUnlocked
          ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/20'
          : 'opacity-50 cursor-not-allowed',
        isCompleted && 'ring-2 ring-teal-500'
      )}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 opacity-5',
        isUnlocked ? 'bg-gradient-to-br from-teal-500 to-cyan-500' : 'bg-slate-700'
      )} />
      
      {/* Status indicator */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">✓</span>
          </div>
        </div>
      )}
      
      {/* Lock indicator */}
      {!isUnlocked && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-slate-400 text-lg">🔒</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{mission.icon}</span>
          <div>
            <CardTitle className="text-lg text-white">
              Mission {mission.id}: {mission.title}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {mission.subtitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300 line-clamp-2">{mission.description}</p>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={cn('text-white', `bg-gradient-to-r ${difficultyColors[mission.difficulty]}`)}>
            {mission.difficulty}
          </Badge>
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            {mission.duration}
          </Badge>
          <XPBadge xp={mission.xpReward} size="sm" />
        </div>

        {isCompleted && score !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Score:</span>
            <Badge 
              className={cn(
                'text-white',
                score >= 80 ? 'bg-green-500' : 'bg-yellow-500'
              )}
            >
              {score}%
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Content Section Component
export function ContentSection({
  section,
  onContinue,
  currentSection,
  totalSections,
}: {
  section: {
    id: string;
    title: string;
    content: string;
    keyPoints?: string[];
    example?: string;
  };
  onContinue: () => void;
  currentSection: number;
  totalSections: number;
}) {
  // Parse markdown-like content
  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      // Handle headers
      if (paragraph.startsWith('**') && paragraph.includes(':**')) {
        const headerMatch = paragraph.match(/\*\*(.+?):\*\*/);
        if (headerMatch) {
          const rest = paragraph.replace(/\*\*.+?:\*\*/, '').trim();
          return (
            <div key={i} className="mt-4 mb-2">
              <h4 className="text-lg font-semibold text-teal-400 mb-2">
                {headerMatch[1]}
              </h4>
              <p className="text-slate-300">{rest}</p>
            </div>
          );
        }
      }
      
      // Handle lists
      if (paragraph.includes('\n- ') || paragraph.includes('\n* ')) {
        const lines = paragraph.split('\n');
        const title = lines[0];
        const items = lines.slice(1).filter(l => l.startsWith('- ') || l.startsWith('* '));
        
        return (
          <div key={i} className="my-3">
            {title && <p className="text-slate-300 mb-2">{title.replace(/^\*\*(.+?)\*\*/, '$1')}</p>}
            <ul className="space-y-1 pl-4">
              {items.map((item, j) => (
                <li key={j} className="text-slate-300 flex gap-2">
                  <span className="text-teal-400">•</span>
                  <span>{item.replace(/^[-*] /, '').replace(/\*\*(.+?)\*\*/g, '$1')}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // Handle numbered lists
      if (paragraph.includes('\n1. ') || /\n\d+\. /.test(paragraph)) {
        const lines = paragraph.split('\n');
        const title = lines[0];
        const items = lines.slice(1).filter(l => /^\d+\. /.test(l));
        
        return (
          <div key={i} className="my-3">
            {title && <p className="text-slate-300 mb-2">{title.replace(/\*\*/g, '')}</p>}
            <ol className="space-y-2 pl-4">
              {items.map((item, j) => (
                <li key={j} className="text-slate-300 flex gap-2">
                  <span className="text-teal-400 font-bold">{item.match(/^\d+\./)?.[0]}</span>
                  <span>{item.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, '$1')}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      }
      
      // Handle tables (simplified)
      if (paragraph.includes('|')) {
        const rows = paragraph.split('\n').filter(r => r.includes('|'));
        if (rows.length >= 2) {
          const headers = rows[0].split('|').filter(c => c.trim());
          const bodyRows = rows.slice(2);
          
          return (
            <div key={i} className="my-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    {headers.map((h, j) => (
                      <th key={j} className="px-4 py-2 text-left text-teal-400 font-semibold">
                        {h.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, j) => {
                    const cells = row.split('|').filter(c => c.trim());
                    return (
                      <tr key={j} className="border-b border-slate-700">
                        {cells.map((cell, k) => (
                          <td key={k} className="px-4 py-2 text-slate-300">
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
      }
      
      // Regular paragraph
      return (
        <p key={i} className="text-slate-300 my-3 leading-relaxed">
          {paragraph.replace(/\*\*(.+?)\*\*/g, '$1')}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-6">
        <GameProgressBar
          value={currentSection + 1}
          max={totalSections}
          label="Reading Progress"
        />
      </div>

      {/* Content card */}
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">{section.title}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          {renderContent(section.content)}
          
          {/* Key Points */}
          {section.keyPoints && section.keyPoints.length > 0 && (
            <div className="mt-6 p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
              <h4 className="text-lg font-semibold text-teal-400 mb-3">Key Takeaways</h4>
              <ul className="space-y-2">
                {section.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-slate-300">
                    <span className="text-teal-400">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example */}
          {section.example && (
            <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
              <h4 className="text-lg font-semibold text-amber-400 mb-2">Example</h4>
              <p className="text-slate-300 italic">{section.example}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Continue button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
}

// Quiz Component
export function Quiz({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
  onNext,
  isCorrect,
}: {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | number | null;
  showFeedback: boolean;
  onSelectAnswer: (answer: string | number) => void;
  onNext: () => void;
  isCorrect: boolean;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Question {questionNumber + 1} of {totalQuestions}</span>
          <span>+{question.xpValue} XP</span>
        </div>
        <Progress 
          value={((questionNumber + 1) / totalQuestions) * 100} 
          className="h-2 bg-slate-800" 
        />
      </div>

      {/* Question */}
      <Card className="bg-slate-900/80 border-slate-700 mb-6">
        <CardHeader>
          <Badge className={cn(
            'w-fit mb-2',
            question.type === 'scenario' ? 'bg-purple-500' : 'bg-blue-500'
          )}>
            {question.type === 'scenario' ? 'Scenario' : 'Multiple Choice'}
          </Badge>
          <CardTitle className="text-xl text-white">{question.question}</CardTitle>
        </CardHeader>
      </Card>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = question.correctAnswer === index;
          
          let optionStyle = 'bg-slate-800 border-slate-600 hover:border-teal-500';
          
          if (showFeedback) {
            if (isCorrectAnswer) {
              optionStyle = 'bg-green-900/50 border-green-500';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-red-900/50 border-red-500';
            }
          } else if (isSelected) {
            optionStyle = 'bg-teal-900/50 border-teal-500';
          }

          return (
            <button
              key={index}
              onClick={() => !showFeedback && onSelectAnswer(index)}
              disabled={showFeedback}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
                optionStyle,
                !showFeedback && 'cursor-pointer hover:scale-[1.01]'
              )}
            >
              <div className="flex items-start gap-3">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  isSelected || (showFeedback && isCorrectAnswer)
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-700 text-slate-300'
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-slate-200 pt-1">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <Card className={cn(
          'mt-6',
          isCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'
        )}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
              <div>
                <p className="font-semibold text-white mb-1">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-slate-300">{question.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={onNext}
          disabled={!showFeedback}
          size="lg"
          className={cn(
            'px-8',
            showFeedback
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
              : 'bg-slate-700'
          )}
        >
          {questionNumber + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
}

// Results Component
export function Results({
  mission,
  score,
  earnedXP,
  passed,
  onReturnToMap,
  onRetry,
}: {
  mission: Mission;
  score: number;
  earnedXP: number;
  passed: boolean;
  onReturnToMap: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Result icon */}
      <div className={cn(
        'w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl mb-6',
        passed ? 'bg-green-500/20' : 'bg-red-500/20'
      )}>
        {passed ? '🎉' : '📚'}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-2">
        {passed ? 'Mission Complete!' : 'Keep Learning!'}
      </h2>
      <p className="text-slate-400 mb-6">
        {passed 
          ? `You've successfully completed Mission ${mission.id}: ${mission.title}`
          : `You need 80% to pass. Review the content and try again.`
        }
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-white">{score}%</p>
            <p className="text-sm text-slate-400">Score</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-teal-400">{earnedXP}</p>
            <p className="text-sm text-slate-400">XP Earned</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-white">{passed ? '✓' : '✗'}</p>
            <p className="text-sm text-slate-400">Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onReturnToMap}
          variant="outline"
          className="border-slate-600 text-slate-300"
        >
          Back to Missions
        </Button>
        {!passed && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-teal-500 to-cyan-500"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

// Certificate Component
export function Certificate({
  playerName,
  xp,
  completedAt,
}: {
  playerName: string;
  xp: number;
  completedAt: string;
}) {
  const date = new Date(completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-teal-500 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <CardContent className="p-8 relative">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/swipeup-logo.jpeg" 
              alt="SwipeUp AI Society" 
              className="h-16 w-auto rounded-lg"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <p className="text-teal-400 uppercase tracking-widest text-sm mb-2">
              Certificate of Completion
            </p>
            <h2 className="text-3xl font-bold text-white">
              SwipeUp AI Quest
            </h2>
            <p className="text-slate-400 mt-1">
              AI Literacy for Business Students
            </p>
          </div>

          {/* Recipient */}
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm">This is to certify that</p>
            <p className="text-2xl font-bold text-teal-400 my-2">{playerName}</p>
            <p className="text-slate-400 text-sm">
              has successfully completed all six missions of the
              <br />
              <span className="text-white font-semibold">SwipeUp AI Quest Program</span>
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{xp.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">6</p>
              <p className="text-slate-400 text-sm">Missions</p>
            </div>
          </div>

          {/* Date */}
          <div className="text-center border-t border-slate-700 pt-6">
            <p className="text-slate-400 text-sm">Completed on</p>
            <p className="text-white font-semibold">{date}</p>
          </div>

          {/* Badge */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full">
              <span>🏆</span>
              <span className="font-semibold">AI Quest Graduate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Header Component
export function GameHeader({ 
  playerName, 
  xp, 
  missionsCompleted,
  onReset,
}: { 
  playerName: string;
  xp: number;
  missionsCompleted: number;
  onReset?: () => void;
}) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/swipeup-logo.jpeg" 
            alt="SwipeUp AI Society" 
            className="h-10 w-auto rounded"
          />
          <div>
            <h1 className="text-lg font-bold text-white">AI Quest</h1>
            <p className="text-xs text-slate-400">SwipeUp AI Society</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <XPBadge xp={xp} size="sm" />
          
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
            <span>📊</span>
            <span>{missionsCompleted}/6 Missions</span>
          </div>

          <div className="hidden sm:block text-sm text-slate-300">
            <span className="text-teal-400">{playerName}</span>
          </div>

          {onReset && (
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
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
      <div className={cn(
        'absolute inset-0 opacity-5',
        isUnlocked ? 'bg-gradient-to-br from-teal-500 to-cyan-500' : 'bg-slate-700'
      )} />
      
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm sm:text-lg">✓</span>
          </div>
        </div>
      )}
      
      {!isUnlocked && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-slate-400 text-sm sm:text-lg">🔒</span>
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl flex-shrink-0">{mission.icon}</span>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg text-white leading-tight">
              Mission {mission.id}: {mission.title}
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs sm:text-sm truncate">
              {mission.subtitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">{mission.description}</p>
        
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Badge className={cn('text-white text-xs', `bg-gradient-to-r ${difficultyColors[mission.difficulty]}`)}>
            {mission.difficulty}
          </Badge>
          <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
            {mission.duration}
          </Badge>
          <XPBadge xp={mission.xpReward} size="sm" />
        </div>

        {isCompleted && score !== undefined && (
          <div className="flex items-center gap-2 text-xs sm:text-sm">
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

// Interactive Mind Map Component - Visual Learning Tool
function MindMapView({ 
  section 
}: { 
  section: {
    id: string;
    title: string;
    content: string;
    keyPoints?: string[];
    example?: string;
  };
}) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // Extract and transform content into visual concepts
  const extractConcepts = (content: string, keyPoints?: string[]) => {
    const concepts: { 
      icon: string; 
      title: string; 
      quickRef: string; 
      details: string[];
      tip?: string;
    }[] = [];

    // Parse the content to extract meaningful concepts
    const paragraphs = content.split('\n\n');
    
    paragraphs.forEach(para => {
      const headerMatch = para.match(/\*\*(.+?):\*\*/);
      if (headerMatch) {
        const title = headerMatch[1];
        const items: string[] = [];
        
        const lines = para.split('\n');
        lines.forEach(line => {
          const bulletMatch = line.match(/^[-*] (.+)/);
          if (bulletMatch) {
            items.push(bulletMatch[1].replace(/\*\*(.+?)\*\*/g, '$1'));
          }
        });
        
        if (items.length > 0) {
          // Create a quick reference summary (first 6 words of first item)
          const quickRef = items[0].split(' ').slice(0, 6).join(' ') + (items[0].split(' ').length > 6 ? '...' : '');
          
          // Assign icon based on keywords
          let icon = '📌';
          const titleLower = title.toLowerCase();
          if (titleLower.includes('what is') || titleLower.includes('definition')) icon = '🎯';
          else if (titleLower.includes('how') || titleLower.includes('work')) icon = '⚙️';
          else if (titleLower.includes('why') || titleLower.includes('benefit')) icon = '💡';
          else if (titleLower.includes('type') || titleLower.includes('kind')) icon = '📋';
          else if (titleLower.includes('example') || titleLower.includes('case')) icon = '🔬';
          else if (titleLower.includes('use') || titleLower.includes('apply')) icon = '🛠️';
          else if (titleLower.includes('important') || titleLower.includes('key')) icon = '🔑';
          else if (titleLower.includes('tip') || titleLower.includes('remember')) icon = '💭';
          else if (titleLower.includes('step') || titleLower.includes('process')) icon = '📊';
          
          concepts.push({
            icon,
            title,
            quickRef,
            details: items,
            tip: items.length > 3 ? `Remember: ${items[0].substring(0, 50)}...` : undefined
          });
        }
      }
      
      // Handle bullet lists without headers
      if ((para.includes('\n- ') || para.includes('\n* ')) && !para.includes('**')) {
        const lines = para.split('\n');
        const items = lines
          .filter(l => l.startsWith('- ') || l.startsWith('* '))
          .map(l => l.replace(/^[-*] /, '').replace(/\*\*(.+?)\*\*/g, '$1'));
        
        if (items.length > 0) {
          concepts.push({
            icon: '✨',
            title: 'Key Points',
            quickRef: items[0].split(' ').slice(0, 6).join(' ') + '...',
            details: items
          });
        }
      }
    });
    
    // Add key takeaways if available
    if (keyPoints && keyPoints.length > 0) {
      concepts.push({
        icon: '🏆',
        title: 'Remember This',
        quickRef: keyPoints[0].split(' ').slice(0, 6).join(' ') + '...',
        details: keyPoints,
        tip: 'These are the most important points!'
      });
    }
    
    return concepts;
  };

  const concepts = extractConcepts(section.content, section.keyPoints);
  
  // Color schemes
  const colors = [
    { gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-500/10', border: 'border-teal-500', text: 'text-teal-400' },
    { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-400' },
    { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500', text: 'text-amber-400' },
    { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', border: 'border-green-500', text: 'text-green-400' },
    { gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-400' },
    { gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', border: 'border-rose-500', text: 'text-rose-400' },
  ];

  return (
    <div className="w-full py-4">
      {/* Interactive Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full border border-teal-500/30">
          <span className="text-xl">🗺️</span>
          <span className="text-sm font-medium text-teal-400">Quick Visual Guide</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">👆 Click on each card to explore details</p>
      </div>

      {/* Central Topic with Animation */}
      <div className="flex justify-center mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative px-8 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-xl text-center">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-lg animate-bounce shadow-lg">
              💡
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-slate-900 rounded-full text-xs text-slate-400 border border-slate-700">
              {concepts.length} concepts
            </div>
            <h3 className="text-lg font-bold text-white max-w-[250px]">{section.title}</h3>
          </div>
        </div>
      </div>

      {/* Interactive Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {concepts.map((concept, i) => {
          const color = colors[i % colors.length];
          const isActive = activeCard === i;
          
          return (
            <div 
              key={i}
              onClick={() => setActiveCard(isActive ? null : i)}
              className={cn(
                'relative rounded-xl cursor-pointer transition-all duration-300 overflow-hidden',
                isActive ? 'ring-2 ring-teal-500 scale-[1.02]' : 'hover:scale-[1.01]'
              )}
            >
              {/* Card Header */}
              <div className={cn(
                'px-4 py-3 flex items-center gap-3',
                `bg-gradient-to-r ${color.gradient}`
              )}>
                <span className="text-2xl">{concept.icon}</span>
                <h4 className="text-sm font-bold text-white flex-1">{concept.title}</h4>
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center transition-transform',
                  isActive ? 'rotate-180 bg-white/20' : 'bg-white/10'
                )}>
                  <span className="text-white text-xs">{isActive ? '▲' : '▼'}</span>
                </div>
              </div>
              
              {/* Card Content */}
              <div className={cn(
                'p-4 border-x border-b transition-all duration-300',
                color.bg,
                color.border,
                isActive ? 'max-h-[500px] opacity-100' : 'max-h-[60px] opacity-70'
              )}>
                {/* Quick Reference (always visible) */}
                <div className={cn(
                  'text-sm text-slate-300 mb-2',
                  isActive ? 'font-medium' : 'line-clamp-2'
                )}>
                  {isActive ? '📖 Details:' : concept.quickRef}
                </div>
                
                {/* Expanded Details */}
                {isActive && (
                  <div className="space-y-2 animate-fade-in">
                    {concept.details.map((detail, j) => (
                      <div 
                        key={j}
                        className="flex items-start gap-2 text-sm text-slate-200 p-2 rounded-lg bg-slate-800/50"
                      >
                        <span className={cn('mt-0.5', color.text)}>•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                    
                    {concept.tip && (
                      <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <p className="text-xs text-amber-400">💡 {concept.tip}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-World Example */}
      {section.example && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-400 mb-1">Real-World Example</h4>
              <p className="text-sm text-slate-200">{section.example}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Self-Check */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 border border-blue-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h4 className="text-sm font-bold text-blue-400">Quick Self-Check</h4>
          </div>
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            {showQuiz ? 'Hide' : 'Test Yourself'}
          </button>
        </div>
        
        {showQuiz && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-slate-300">
              Can you explain <strong className="text-white">{section.title}</strong> in your own words?
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setQuizAnswer('got-it')}
                className={cn(
                  'p-3 rounded-lg text-sm transition-all',
                  quizAnswer === 'got-it' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                ✅ Got it!
              </button>
              <button
                onClick={() => setQuizAnswer('review')}
                className={cn(
                  'p-3 rounded-lg text-sm transition-all',
                  quizAnswer === 'review' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                )}
              >
                📖 Need Review
              </button>
            </div>
            
            {quizAnswer && (
              <div className={cn(
                'p-3 rounded-lg text-sm animate-fade-in',
                quizAnswer === 'got-it' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              )}>
                {quizAnswer === 'got-it' 
                  ? '🎉 Great job! You understand this concept!' 
                  : '💪 No worries! Go back to reading mode to review.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Content Section Component
export function ContentSection({
  section,
  onContinue,
  onBack,
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
  onBack?: () => void;
  currentSection: number;
  totalSections: number;
}) {
  const [viewMode, setViewMode] = useState<'reading' | 'visual'>('reading');

  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, i) => {
      if (paragraph.startsWith('**') && paragraph.includes(':**')) {
        const headerMatch = paragraph.match(/\*\*(.+?):\*\*/);
        if (headerMatch) {
          const rest = paragraph.replace(/\*\*.+?:\*\*/, '').trim();
          return (
            <div key={i} className="mt-3 sm:mt-4 mb-2">
              <h4 className="text-base sm:text-lg font-semibold text-teal-400 mb-2">
                {headerMatch[1]}
              </h4>
              <p className="text-sm sm:text-base text-slate-300">{rest}</p>
            </div>
          );
        }
      }
      
      if (paragraph.includes('\n- ') || paragraph.includes('\n* ')) {
        const lines = paragraph.split('\n');
        const title = lines[0];
        const items = lines.slice(1).filter(l => l.startsWith('- ') || l.startsWith('* '));
        
        return (
          <div key={i} className="my-2 sm:my-3">
            {title && <p className="text-sm sm:text-base text-slate-300 mb-2">{title.replace(/^\*\*(.+?)\*\*/, '$1')}</p>}
            <ul className="space-y-1 pl-3 sm:pl-4">
              {items.map((item, j) => (
                <li key={j} className="text-sm sm:text-base text-slate-300 flex gap-2">
                  <span className="text-teal-400 flex-shrink-0">•</span>
                  <span>{item.replace(/^[-*] /, '').replace(/\*\*(.+?)\*\*/g, '$1')}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      if (paragraph.includes('\n1. ') || /\n\d+\. /.test(paragraph)) {
        const lines = paragraph.split('\n');
        const title = lines[0];
        const items = lines.slice(1).filter(l => /^\d+\. /.test(l));
        
        return (
          <div key={i} className="my-2 sm:my-3">
            {title && <p className="text-sm sm:text-base text-slate-300 mb-2">{title.replace(/\*\*/g, '')}</p>}
            <ol className="space-y-1.5 sm:space-y-2 pl-3 sm:pl-4">
              {items.map((item, j) => (
                <li key={j} className="text-sm sm:text-base text-slate-300 flex gap-2">
                  <span className="text-teal-400 font-bold flex-shrink-0">{item.match(/^\d+\./)?.[0]}</span>
                  <span>{item.replace(/^\d+\. /, '').replace(/\*\*(.+?)\*\*/g, '$1')}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      }
      
      if (paragraph.includes('|')) {
        const rows = paragraph.split('\n').filter(r => r.includes('|'));
        if (rows.length >= 2) {
          const headers = rows[0].split('|').filter(c => c.trim());
          const bodyRows = rows.slice(2);
          
          return (
            <div key={i} className="my-3 sm:my-4 overflow-x-auto -mx-2 sm:mx-0">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    {headers.map((h, j) => (
                      <th key={j} className="px-2 sm:px-4 py-2 text-left text-teal-400 font-semibold whitespace-nowrap">
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
                          <td key={k} className="px-2 sm:px-4 py-2 text-slate-300">
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
      
      return (
        <p key={i} className="text-sm sm:text-base text-slate-300 my-2 sm:my-3 leading-relaxed">
          {paragraph.replace(/\*\*(.+?)\*\*/g, '$1')}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 sm:mb-6 px-1">
        <GameProgressBar
          value={currentSection + 1}
          max={totalSections}
          label="Reading Progress"
        />
      </div>

      <div className="flex justify-center mb-4 px-4">
        <div className="inline-flex rounded-lg bg-slate-800 p-1">
          <button
            onClick={() => setViewMode('reading')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              viewMode === 'reading'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            )}
          >
            📖 Reading
          </button>
          <button
            onClick={() => setViewMode('visual')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              viewMode === 'visual'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            )}
          >
            🗺️ Visual Map
          </button>
        </div>
      </div>

      <Card className="bg-slate-900/80 border-slate-700 mx-2 sm:mx-0">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-xl sm:text-2xl text-white">{section.title}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none px-4 sm:px-6">
          {viewMode === 'reading' ? (
            <>
              {renderContent(section.content)}
              
              {section.keyPoints && section.keyPoints.length > 0 && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
                  <h4 className="text-base sm:text-lg font-semibold text-teal-400 mb-2 sm:mb-3">Key Takeaways</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {section.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm sm:text-base text-slate-300">
                        <span className="text-teal-400 flex-shrink-0">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.example && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <h4 className="text-base sm:text-lg font-semibold text-amber-400 mb-2">Example</h4>
                  <p className="text-sm sm:text-base text-slate-300 italic">{section.example}</p>
                </div>
              )}
            </>
          ) : (
            <div className="py-4">
              <MindMapView section={section} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 sm:mt-6 flex justify-between gap-3 px-4">
        {onBack && currentSection > 0 ? (
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="border-slate-600 text-slate-300 hover:bg-slate-800 px-6"
          >
            <span className="mr-2">←</span>
            Back
          </Button>
        ) : (
          <div />
        )}
        
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 sm:px-8"
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
    <div className="max-w-3xl mx-auto px-2 sm:px-4">
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-2">
          <span>Question {questionNumber + 1} of {totalQuestions}</span>
          <span>+{question.xpValue} XP</span>
        </div>
        <Progress 
          value={((questionNumber + 1) / totalQuestions) * 100} 
          className="h-2 bg-slate-800" 
        />
      </div>

      <Card className="bg-slate-900/80 border-slate-700 mb-4 sm:mb-6">
        <CardHeader className="pb-2">
          <Badge className={cn(
            'w-fit mb-2 text-xs',
            question.type === 'scenario' ? 'bg-purple-500' : 'bg-blue-500'
          )}>
            {question.type === 'scenario' ? 'Scenario' : 'Multiple Choice'}
          </Badge>
          <CardTitle className="text-base sm:text-xl text-white leading-snug">{question.question}</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-2 sm:space-y-3">
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
                'w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200',
                optionStyle,
                !showFeedback && 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
              )}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <span className={cn(
                  'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0',
                  isSelected || (showFeedback && isCorrectAnswer)
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-700 text-slate-300'
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm sm:text-base text-slate-200 pt-0.5 sm:pt-1">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <Card className={cn(
          'mt-4 sm:mt-6 mx-1',
          isCorrect ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'
        )}>
          <CardContent className="pt-4 sm:pt-6 px-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">{isCorrect ? '✅' : '❌'}</span>
              <div>
                <p className="font-semibold text-white mb-1 text-sm sm:text-base">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-xs sm:text-base text-slate-300">{question.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 sm:mt-6 flex justify-center px-2">
        <Button
          onClick={onNext}
          disabled={!showFeedback}
          size="lg"
          className={cn(
            'px-6 sm:px-8 w-full sm:w-auto',
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
    <div className="max-w-2xl mx-auto text-center px-4">
      <div className={cn(
        'w-16 h-16 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center text-4xl sm:text-5xl mb-4 sm:mb-6',
        passed ? 'bg-green-500/20' : 'bg-red-500/20'
      )}>
        {passed ? '🎉' : '📚'}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        {passed ? 'Mission Complete!' : 'Keep Learning!'}
      </h2>
      <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6 px-2">
        {passed 
          ? `You've successfully completed Mission ${mission.id}: ${mission.title}`
          : `You need 80% to pass. Review the content and try again.`
        }
      </p>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="py-3 sm:py-6 px-2">
            <p className="text-xl sm:text-3xl font-bold text-white">{score}%</p>
            <p className="text-xs sm:text-sm text-slate-400">Score</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="py-3 sm:py-6 px-2">
            <p className="text-xl sm:text-3xl font-bold text-teal-400">{earnedXP}</p>
            <p className="text-xs sm:text-sm text-slate-400">XP Earned</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-700">
          <CardContent className="py-3 sm:py-6 px-2">
            <p className="text-xl sm:text-3xl font-bold text-white">{passed ? '✓' : '✗'}</p>
            <p className="text-xs sm:text-sm text-slate-400">Status</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
        <Button
          onClick={onReturnToMap}
          variant="outline"
          className="border-slate-600 text-slate-300 w-full sm:w-auto"
        >
          Back to Missions
        </Button>
        {!passed && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 w-full sm:w-auto"
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
    <div className="max-w-2xl mx-auto px-4">
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-teal-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-teal-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/10 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <CardContent className="p-4 sm:p-8 relative">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img 
              src="/SwipeUp-AI-Quest/swipeup-logo.jpeg" 
              alt="SwipeUp AI Society" 
              className="h-16 sm:h-24 w-auto object-contain rounded-lg"
            />
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <p className="text-teal-400 uppercase tracking-widest text-xs sm:text-sm mb-2">
              Certificate of Completion
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              SwipeUp AI Quest
            </h2>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              AI Literacy for Business Students
            </p>
          </div>

          <div className="text-center mb-4 sm:mb-8">
            <p className="text-slate-400 text-xs sm:text-sm">This is to certify that</p>
            <p className="text-xl sm:text-2xl font-bold text-teal-400 my-1 sm:my-2">{playerName}</p>
            <p className="text-slate-400 text-xs sm:text-sm px-2">
              has successfully completed all six missions of the
              <br />
              <span className="text-white font-semibold">SwipeUp AI Quest Program</span>
            </p>
          </div>

          <div className="flex justify-center gap-6 sm:gap-8 mb-4 sm:mb-8">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{xp.toLocaleString()}</p>
              <p className="text-slate-400 text-xs sm:text-sm">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">6</p>
              <p className="text-slate-400 text-xs sm:text-sm">Missions</p>
            </div>
          </div>

          <div className="text-center border-t border-slate-700 pt-4 sm:pt-6">
            <p className="text-slate-400 text-xs sm:text-sm">Completed on</p>
            <p className="text-white font-semibold text-sm sm:text-base">{date}</p>
          </div>

          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
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
  showBackButton,
  onBackToMissions,
}: { 
  playerName: string;
  xp: number;
  missionsCompleted: number;
  showBackButton?: boolean;
  onBackToMissions?: () => void;
}) {
  return (
    <header className="bg-slate-900/90 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {showBackButton && onBackToMissions && (
            <Button
              onClick={onBackToMissions}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800 mr-1"
            >
              <span className="mr-1">←</span>
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          <img 
            src="/SwipeUp-AI-Quest/swipeup-logo.jpeg" 
            alt="SwipeUp AI Society" 
            className="h-8 w-auto sm:h-10 object-contain rounded flex-shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">AI Quest</h1>
            <p className="text-xs text-slate-400 hidden sm:block">SwipeUp AI Society</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <XPBadge xp={xp} size="sm" />
          
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
            <span>📊</span>
            <span>{missionsCompleted}/6</span>
          </div>

          {playerName && (
            <div className="hidden md:block text-sm text-slate-300 max-w-[120px] truncate">
              <span className="text-teal-400">{playerName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import StudentTwinAvatar3D from './StudentTwinAvatar3D';
import { getTwinMessage, getTwinMotivationalNote } from './TwinMessageEngine';
import { Sparkles, Brain, Flame, Target, Activity, RefreshCw, Zap, ArrowRight, BookOpen } from 'lucide-react';

/**
 * DashboardTwinHero - The Visual Centerpiece of StudyTwin AI
 * 
 * Features:
 * - 3D Mini Student Twin Character Visual (StudentTwinAvatar3D)
 * - Gender Personalization support
 * - Contextual Twin Dialogue derived from real database metrics
 * - "A Note From Your Twin" motivational callout
 * - Interactive synchronization feedback
 */
export default function DashboardTwinHero({
  user,
  dashboardData,
  onSync,
  className = ''
}) {
  const [interactiveState, setInteractiveState] = useState('normal'); // 'normal' | 'pulsing' | 'synced'

  const overallProgress = dashboardData?.overallProgress || 0;
  const examReadiness = dashboardData?.examReadiness || 0;
  const streak = dashboardData?.currentStreak || 0;
  const recommendedNext = dashboardData?.recommendedNextActivity;

  // Personalization
  const gender = user?.gender?.toLowerCase() || 'neutral';
  const twinMsg = getTwinMessage(user, dashboardData);
  const twinNote = getTwinMotivationalNote(dashboardData);

  const handleHeroClick = () => {
    setInteractiveState('pulsing');
    setTimeout(() => setInteractiveState('synced'), 600);
    setTimeout(() => setInteractiveState('normal'), 2500);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-slate-950/80 dark:bg-slate-950/90 light:bg-white/90 border border-teal-500/30 dark:border-teal-500/30 light:border-amber-400/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Ambient Atmospheric Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-teal-500/20 via-fuchsia-600/20 to-amber-400/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-600/20 via-pink-500/20 to-transparent blur-3xl pointer-events-none" />

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Column: Twin Greeting & Real State Dialogue */}
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 via-fuchsia-500/20 to-amber-500/20 border border-teal-500/40 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-teal-400 dark:text-teal-300 light:text-amber-600 animate-pulse" />
            <span className="text-xs font-bold bg-gradient-to-r from-teal-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent dark:from-teal-300 dark:via-fuchsia-200 dark:to-amber-200 light:from-teal-700 light:via-purple-700 light:to-amber-700 uppercase tracking-wider">
              YOUR DIGITAL TWIN ENGINE • LIVE STATE
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 dark:text-white light:text-slate-900 tracking-tight">
            Good morning, <span className="bg-gradient-to-r from-teal-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">{user?.name || 'Student'}</span>!
          </h1>

          {/* Contextual Dialogue from Real Data */}
          <div className="p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-900/80 light:bg-amber-50/80 border border-teal-500/20 dark:border-teal-500/20 light:border-amber-300/60 backdrop-blur-md text-left space-y-1.5">
            <p className="text-sm font-medium text-slate-200 dark:text-slate-200 light:text-slate-800 leading-relaxed">
              "{twinMsg.dialogue}"
            </p>
            <p className="text-xs font-semibold text-teal-400 dark:text-teal-300 light:text-teal-700 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 inline" />
              <span>{twinMsg.highlight}</span>
            </p>
          </div>

          {/* Quick Metrics Readout */}
          <div className="pt-1 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
            <div className="p-3 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center shadow-md">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider block">Mastery</span>
              <span className="text-lg sm:text-xl font-black text-teal-400 dark:text-teal-300 light:text-teal-600">{overallProgress}%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center shadow-md">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider block">Readiness</span>
              <span className="text-lg sm:text-xl font-black text-fuchsia-400 dark:text-fuchsia-300 light:text-fuchsia-600">{examReadiness}%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-center shadow-md">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase tracking-wider block">Streak</span>
              <span className="text-lg sm:text-xl font-black text-amber-400 dark:text-amber-300 light:text-amber-600">{streak}d</span>
            </div>
          </div>

          {/* Sync Button & State Indicator */}
          <div className="pt-2 flex items-center justify-center lg:justify-start space-x-3">
            <button
              onClick={() => {
                handleHeroClick();
                if (onSync) onSync();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 via-purple-600 to-pink-600 hover:from-teal-400 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-teal-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${interactiveState === 'pulsing' ? 'animate-spin' : ''}`} />
              <span>{interactiveState === 'synced' ? 'Twin Synced!' : 'Synchronize Twin Memory'}</span>
            </button>

            <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Twin Active</span>
            </span>
          </div>
        </div>

        {/* Right Column: 3D Mini Student Twin Character */}
        <div
          onClick={handleHeroClick}
          className="relative flex-shrink-0 cursor-pointer group p-4 rounded-3xl bg-slate-900/40 dark:bg-slate-900/50 light:bg-white/60 border border-teal-500/30 hover:border-fuchsia-500/50 transition-all duration-300 shadow-xl"
          title="Click to interact with your 3D Student Twin"
        >
          {/* Animated Glow Aura */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-teal-500/15 via-fuchsia-500/15 to-amber-400/15 group-hover:opacity-100 opacity-60 transition-opacity" />

          {/* 3D Mini Student Character */}
          <div className="relative z-10 p-2">
            <StudentTwinAvatar3D
              gender={gender}
              size="hero"
              animated={interactiveState !== 'normal' || true}
              status={interactiveState === 'synced' ? 'synced' : 'active'}
            />
          </div>

          {/* Floating Live Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/90 dark:bg-slate-950/90 light:bg-white/90 border border-teal-400/40 text-[10px] font-bold text-teal-300 dark:text-teal-300 light:text-teal-700 shadow-md backdrop-blur-md flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>3D Student Twin</span>
          </div>
        </div>
      </div>

      {/* Motivational Note Callout Banner ("A NOTE FROM YOUR TWIN") */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
        <div className="flex items-center space-x-2">
          <span className="font-black text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-300 dark:text-teal-300 light:text-teal-800 border border-teal-500/30">
            {twinNote.author}
          </span>
          <span className="italic font-medium">"{twinNote.quote}"</span>
        </div>

        {recommendedNext && (
          <div className="flex-shrink-0 flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-xl text-purple-300 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Recommended: {recommendedNext.topicName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

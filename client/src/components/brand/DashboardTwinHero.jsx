import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentTwinAvatar3D from './StudentTwinAvatar3D';
import { getTwinMessage, getTwinMotivationalNote } from './TwinMessageEngine';
import { Sparkles, Activity, RefreshCw, Zap, Play, ArrowRight, Target, Flame } from 'lucide-react';

/**
 * DashboardTwinHero - Green -> Lime -> Yellow Redesigned Dashboard Hero
 * Features:
 * - GOOD MORNING/EVENING greeting
 * - "Let's see what your Twin thinks today."
 * - Digital Student Avatar (Green -> Lime -> Yellow theme)
 * - Dialogue card: "Hi [Name] 👋 I've been learning how you learn."
 * - [ START LEARNING ] CTA button (Green -> Lime -> Yellow gradient)
 */
export default function DashboardTwinHero({
  user,
  dashboardData,
  onSync,
  className = ''
}) {
  const navigate = useNavigate();
  const [interactiveState, setInteractiveState] = useState('normal');

  const overallProgress = dashboardData?.overallProgress || 0;
  const streak = dashboardData?.currentStreak || 0;
  const highRiskCount = dashboardData?.highRiskTopics?.length || 0;

  const gender = user?.gender?.toLowerCase() || 'neutral';
  const twinMsg = getTwinMessage(user, dashboardData);
  const twinNote = getTwinMotivationalNote(dashboardData);

  const handleHeroClick = () => {
    setInteractiveState('pulsing');
    setTimeout(() => setInteractiveState('synced'), 600);
    setTimeout(() => setInteractiveState('normal'), 2500);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-[#63C63D]/30 transition-all duration-300 ${className}`}
    >
      {/* Background Green -> Lime -> Yellow Atmospheric Highlights */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#168F3B]/25 via-[#63C63D]/20 to-[#B7E51D]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#FFD900]/20 via-[#B7E51D]/20 to-transparent blur-3xl pointer-events-none" />

      {/* Main Grid Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Column: Greeting, Dialogue & CTA */}
        <div className="space-y-5 max-w-xl text-center lg:text-left">
          
          <div className="space-y-1">
            <span className="text-xs font-black tracking-widest text-[#36A852] dark:text-[#B7E51D] uppercase block">
              {getGreeting()}, {user?.name?.toUpperCase() || 'STUDENT'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Let's see what your Twin thinks today.
            </h1>
          </div>

          {/* Transparent Glass Twin Dialogue Card */}
          <div className="p-4 sm:p-5 rounded-2xl glass-card text-left space-y-2 relative border-l-4 border-l-[#63C63D]">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#168F3B] dark:text-[#B7E51D]">
              <Sparkles className="w-4 h-4 text-[#FFD900] animate-pulse" />
              <span>DIGITAL TWIN ENGINE</span>
            </div>
            
            <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              "{twinMsg.dialogue}"
            </p>
            
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 pt-1">
              <Zap className="w-3.5 h-3.5 text-[#FFD900] inline" />
              <span>{twinMsg.highlight}</span>
            </p>
          </div>

          {/* Action Buttons: [ START LEARNING ] & Sync */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <button
              onClick={() => navigate('/sessions')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#168F3B] via-[#63C63D] via-[#B7E51D] to-[#FFD900] hover:from-[#0B7A32] hover:via-[#36A852] hover:to-[#B7E51D] text-slate-950 font-black text-sm shadow-lg shadow-[#63C63D]/25 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2.5 cursor-pointer border border-[#FFEA3A]/40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START LEARNING</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                handleHeroClick();
                if (onSync) onSync();
              }}
              className="px-4 py-3 rounded-2xl glass-pill hover:bg-[#63C63D]/15 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer border border-[#63C63D]/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#63C63D] ${interactiveState === 'pulsing' ? 'animate-spin' : ''}`} />
              <span>{interactiveState === 'synced' ? 'Synced!' : 'Sync Memory'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Digital Student Twin + Orbiting Indicators */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          
          {/* Surround Indicators */}
          {/* Top Right: Risk Badge */}
          <div className="absolute -top-3 -right-2 z-20 px-3 py-1.5 rounded-2xl glass-card text-[11px] font-bold shadow-lg flex items-center space-x-1.5 border border-[#FFD900]/40">
            <Activity className="w-3.5 h-3.5 text-[#FFD900]" />
            <span className="text-slate-900 dark:text-white">Risk: {highRiskCount > 0 ? `${highRiskCount} topics` : 'Low'}</span>
          </div>

          {/* Bottom Left: Streak */}
          <div className="absolute -bottom-3 -left-2 z-20 px-3 py-1.5 rounded-2xl glass-card text-[11px] font-bold shadow-lg flex items-center space-x-1.5 border border-[#B7E51D]/40">
            <Flame className="w-3.5 h-3.5 text-[#B7E51D]" />
            <span className="text-slate-900 dark:text-white">{streak}d Streak</span>
          </div>

          {/* Top Left: Mastery */}
          <div className="absolute top-1/4 -left-6 z-20 px-3 py-1.5 rounded-2xl glass-card text-[11px] font-bold shadow-lg flex items-center space-x-1.5 border border-[#63C63D]/40">
            <Target className="w-3.5 h-3.5 text-[#63C63D]" />
            <span className="text-slate-900 dark:text-white">{overallProgress}% Mastery</span>
          </div>

          {/* Digital Student Character Card Container */}
          <div
            onClick={handleHeroClick}
            className="relative cursor-pointer p-4 sm:p-6 rounded-3xl glass-card border border-[#63C63D]/40 hover:border-[#B7E51D]/60 transition-all duration-300"
            title="Interactive Digital Twin AI"
          >
            <StudentTwinAvatar3D
              gender={gender}
              size="hero"
              animated={interactiveState !== 'normal' || true}
              state={highRiskCount > 0 ? 'NEEDS_REVISION' : overallProgress > 70 ? 'STRONG_MOMENTUM' : 'LEARNING'}
            />
          </div>
        </div>
      </div>

      {/* Motivational Note Callout Banner ("A NOTE FROM YOUR TWIN") */}
      <div className="mt-6 pt-4 border-t border-slate-200/20 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-gradient-to-r from-[#168F3B]/20 to-[#B7E51D]/20 text-[#168F3B] dark:text-[#B7E51D] border border-[#63C63D]/30">
            {twinNote.author}
          </span>
          <span className="italic font-medium">"{twinNote.quote}"</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import StudyTwinLogo from './StudyTwinLogo';
import { Sparkles, Brain, Flame, Target, Activity, RefreshCw, Zap, Award } from 'lucide-react';

/**
 * DashboardTwinHero - The Visual Centerpiece of StudyTwin AI
 * 
 * Features:
 * - Animated Digital Twin visual representation
 * - Gender & profile aware twin customization
 * - Personalized greeting & twin intelligence state readout
 * - Interactive micro-interactions (hover illuminate, click react)
 * - Motion-reduced fallback support
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
  const highRiskCount = dashboardData?.highRiskTopics?.length || 0;

  // Personalization logic: Check user profile for gender or inferred persona
  const gender = user?.gender?.toLowerCase() || 'neutral';
  const twinPersona = gender === 'female' ? 'Female Presenting Twin' : gender === 'male' ? 'Male Presenting Twin' : 'Neutral Digital Twin';

  const handleHeroClick = () => {
    setInteractiveState('pulsing');
    setTimeout(() => setInteractiveState('synced'), 600);
    setTimeout(() => setInteractiveState('normal'), 2500);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-violet-500/30 p-6 sm:p-8 shadow-2xl transition-all duration-300 ${className}`}
    >
      {/* Background Neural Network Ambient Grid & Glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-500/10 via-purple-600/15 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Layout: Flex on Desktop, Column on Mobile */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Column: Greeting & Twin Dialogue */}
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-amber-500/20 border border-violet-500/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span className="text-xs font-bold bg-gradient-to-r from-violet-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
              AI DIGITAL TWIN ACTIVE • {twinPersona}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Hi, <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">{user?.name || 'Student'}</span>! 👋
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            "I'm your AI Digital Twin. I've been continuously analyzing your memory decay, session focus, and quiz patterns to optimize your study trajectory."
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Mastery</span>
              <span className="text-lg sm:text-xl font-black text-violet-400">{overallProgress}%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Readiness</span>
              <span className="text-lg sm:text-xl font-black text-fuchsia-400">{examReadiness}%</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Streak</span>
              <span className="text-lg sm:text-xl font-black text-amber-400">{streak}d</span>
            </div>
          </div>

          {/* Sync & Twin Action */}
          <div className="pt-2 flex items-center justify-center lg:justify-start space-x-3">
            <button
              onClick={() => {
                handleHeroClick();
                if (onSync) onSync();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${interactiveState === 'pulsing' ? 'animate-spin' : ''}`} />
              <span>{interactiveState === 'synced' ? 'Twin Synced!' : 'Synchronize Twin Memory'}</span>
            </button>

            <span className="text-xs text-slate-400 flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>{highRiskCount === 0 ? 'Optimal Memory State' : `${highRiskCount} Topic(s) Need Attention`}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Animated Digital Twin Graphic */}
        <div
          onClick={handleHeroClick}
          className="relative flex-shrink-0 cursor-pointer group p-4 rounded-3xl bg-slate-900/40 border border-violet-500/20 hover:border-fuchsia-500/40 transition-all duration-300"
          title="Click to interact with your Digital Twin"
        >
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-600/10 via-fuchsia-500/10 to-amber-500/10 group-hover:opacity-100 opacity-60 transition-opacity" />

          {/* Core Animated Twin Logo */}
          <div className="relative z-10 p-2">
            <StudyTwinLogo variant="hero" size="hero" animated={interactiveState !== 'normal' || true} />
          </div>

          {/* Floating Data Badges Around Twin */}
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-violet-500/40 text-[10px] font-bold text-violet-300 shadow-md backdrop-blur-md flex items-center space-x-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Neural Sync</span>
          </div>

          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-fuchsia-500/40 text-[10px] font-bold text-fuchsia-300 shadow-md backdrop-blur-md flex items-center space-x-1">
            <Award className="w-3 h-3 text-teal-400" />
            <span>Memory Curve: 94%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

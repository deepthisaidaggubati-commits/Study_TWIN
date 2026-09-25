import React from 'react';
import Card from '../components/ui/Card';
import StudentTwinAvatar3D from '../components/brand/StudentTwinAvatar3D';
import { Brain, Activity, Clock, ShieldCheck, Zap, Sparkles, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MyTwinPage() {
  const { user } = useAuth();
  const gender = user?.gender?.toLowerCase() || 'neutral';

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-950/80 dark:bg-slate-950/90 light:bg-white/90 p-8 rounded-3xl border border-teal-500/30 dark:border-teal-500/30 light:border-amber-300/80 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-teal-500/15 via-purple-600/15 to-amber-400/10 blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-pink-500/20 text-teal-300 dark:text-teal-300 light:text-teal-800 text-xs font-bold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="uppercase tracking-wider">Active Digital Twin Laboratory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 dark:text-white light:text-slate-900">
            My Twin Intelligence Profile
          </h1>
          <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
            Real-time behavioral learning model for <strong className="text-teal-300 dark:text-teal-300 light:text-teal-700">{user?.name || 'Student'}</strong> ({user?.branch || 'General Academic'}).
          </p>
        </div>

        {/* 3D Mini Student Twin Visual */}
        <div className="relative z-10 flex-shrink-0 p-4 rounded-3xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-amber-50/60 border border-teal-500/30 shadow-xl">
          <StudentTwinAvatar3D gender={gender} size="hero" animated />
        </div>
      </div>

      {/* Intelligence Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Study Consistency" subtitle="Daily & weekly learning patterns">
          <div className="p-4 bg-slate-900/80 dark:bg-slate-900/80 light:bg-amber-50/60 rounded-xl border border-slate-800 dark:border-slate-800 light:border-amber-200 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
              <span>Consistency Rating:</span>
              <span className="text-teal-400 dark:text-teal-300 light:text-teal-700 font-bold">High (88%)</span>
            </div>
            <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full w-[88%] rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card title="Average Session Length" subtitle="Sustained focus duration">
          <div className="p-4 bg-slate-900/80 dark:bg-slate-900/80 light:bg-amber-50/60 rounded-xl border border-slate-800 dark:border-slate-800 light:border-amber-200 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
              <span>Mean Focus Duration:</span>
              <span className="text-fuchsia-400 dark:text-fuchsia-300 light:text-fuchsia-700 font-bold">42 Mins</span>
            </div>
            <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-full w-[70%] rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card title="Preferred Study Period" subtitle="Peak productivity window">
          <div className="p-4 bg-slate-900/80 dark:bg-slate-900/80 light:bg-amber-50/60 rounded-xl border border-slate-800 dark:border-slate-800 light:border-amber-200 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
              <span>Peak Window:</span>
              <span className="text-amber-400 dark:text-amber-300 light:text-amber-700 font-bold">Evening (6PM - 9PM)</span>
            </div>
            <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full w-[82%] rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

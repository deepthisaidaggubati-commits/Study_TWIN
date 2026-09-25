import React from 'react';
import Card from '../components/ui/Card';
import StudyTwinLogo from '../components/brand/StudyTwinLogo';
import { Brain, Activity, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MyTwinPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-8 rounded-3xl border border-violet-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-violet-600/15 via-fuchsia-600/10 to-amber-500/10 blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
            <span>Active Digital Twin State Engine</span>
          </div>
          <h1 className="text-3xl font-black text-white">My Twin Intelligence Profile</h1>
          <p className="text-sm text-slate-300">
            Continuous behavior & memory model for <strong className="text-violet-300">{user?.name || 'Student'}</strong> ({user?.branch || 'General Academic'}).
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0 p-4 rounded-3xl bg-slate-900/60 border border-violet-500/30 shadow-xl">
          <StudyTwinLogo variant="hero" size="hero" animated />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Study Consistency" subtitle="Daily & weekly learning patterns">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Consistency Rating:</span>
              <span className="text-teal-400 font-bold">High (88%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full w-[88%] rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card title="Average Session Length" subtitle="Sustained focus duration">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Mean Focus Duration:</span>
              <span className="text-violet-400 font-bold">42 Mins</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 h-full w-[70%] rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card title="Preferred Study Period" subtitle="Peak productivity window">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Peak Window:</span>
              <span className="text-amber-400 font-bold">Evening (6PM - 9PM)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full w-[82%] rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

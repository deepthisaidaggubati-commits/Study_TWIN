import React from 'react';
import Card from '../components/ui/Card';
import { Brain, Activity, Clock, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MyTwinPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Active Digital Twin Model</span>
          </div>
          <h1 className="text-2xl font-bold text-white">My Twin Intelligence Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time behavioral learning model for {user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Study Consistency" subtitle="Daily & weekly learning patterns">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Consistency Rating:</span>
              <span className="text-emerald-400 font-bold">High (88%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[88%] rounded-full"></div>
            </div>
          </div>
        </Card>

        <Card title="Average Session Length" subtitle="Sustained focus duration">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-300">
              <span>Mean Focus Duration:</span>
              <span className="text-indigo-400 font-bold">42 Mins</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[70%] rounded-full"></div>
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
              <div className="bg-amber-500 h-full w-[82%] rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

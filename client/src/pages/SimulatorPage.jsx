import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Sliders, Sparkles, TrendingUp, Target, ShieldCheck, Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function SimulatorPage() {
  const [hoursScenarioA, setHoursScenarioA] = useState(2);
  const [hoursScenarioB, setHoursScenarioB] = useState(4);
  const [examDays, setExamDays] = useState(30);

  // Generate 4-week simulation projections based on mathematical decay models
  const generateSimulationData = () => {
    const data = [];
    let coverageA = 40;
    let coverageB = 40;
    let readinessA = 45;
    let readinessB = 45;

    const keyA_cov = `Scenario A (${hoursScenarioA}h/day Coverage)`;
    const keyB_cov = `Scenario B (${hoursScenarioB}h/day Coverage)`;
    const keyA_ready = `Scenario A (${hoursScenarioA}h/day Readiness)`;
    const keyB_ready = `Scenario B (${hoursScenarioB}h/day Readiness)`;

    for (let week = 1; week <= 4; week++) {
      coverageA = Math.min(100, Math.round(coverageA + hoursScenarioA * 8));
      coverageB = Math.min(100, Math.round(coverageB + hoursScenarioB * 11));

      readinessA = Math.min(100, Math.round(readinessA + hoursScenarioA * 7));
      readinessB = Math.min(100, Math.round(readinessB + hoursScenarioB * 10));

      const entry = { week: `Week ${week}` };
      entry[keyA_cov] = coverageA;
      entry[keyB_cov] = coverageB;
      entry[keyA_ready] = readinessA;
      entry[keyB_ready] = readinessB;

      data.push(entry);
    }

    return { data, keyA_ready, keyB_ready };
  };

  const { data: chartData, keyA_ready, keyB_ready } = generateSimulationData();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 rounded-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Digital Twin Simulation Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-white">What-if Study Simulator</h1>
        <p className="text-xs text-slate-400 mt-1">
          Simulate prospective study schedules to compare forecasted topic coverage, memory retention, and exam readiness estimates over time.
        </p>
      </div>

      {/* Scenario Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Scenario A Parameters">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Daily Study Time: <span className="text-indigo-400 font-bold">{hoursScenarioA} Hours / Day</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={hoursScenarioA}
                onChange={(e) => setHoursScenarioA(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400">Baseline standard pace suitable for routine learning and revision.</p>
          </div>
        </Card>

        <Card title="Scenario B Parameters">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Daily Study Time: <span className="text-violet-400 font-bold">{hoursScenarioB} Hours / Day</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={hoursScenarioB}
                onChange={(e) => setHoursScenarioB(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400">Accelerated pace focused on rapid topic coverage and intense revision.</p>
          </div>
        </Card>

        <Card title="Target Horizon">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Days Until Exam: <span className="text-emerald-400 font-bold">{examDays} Days</span>
              </label>
              <input
                type="range"
                min="7"
                max="90"
                step="7"
                value={examDays}
                onChange={(e) => setExamDays(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400">Simulates progression across four weekly milestones before exam date.</p>
          </div>
        </Card>
      </div>

      {/* Comparison Projection Chart */}
      <Card title="Comparative 4-Week Readiness & Coverage Forecast" subtitle="Projected trajectories based on digital twin learning parameters">
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey={keyA_ready} stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey={keyB_ready} stroke="#a855f7" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl mt-4 text-xs text-slate-400">
          <span className="font-bold text-slate-200">Note:</span> These values are model-based simulation estimates designed for scenario comparison. They do not guarantee exact exam outcomes.
        </div>
      </Card>
    </div>
  );
}

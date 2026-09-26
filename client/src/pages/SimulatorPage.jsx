import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Sparkles, Sliders } from 'lucide-react';
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

  const generateSimulationData = () => {
    const data = [];
    let coverageA = 40;
    let coverageB = 40;
    let readinessA = 45;
    let readinessB = 45;

    const keyA_ready = `Scenario A (${hoursScenarioA}h/day Readiness)`;
    const keyB_ready = `Scenario B (${hoursScenarioB}h/day Readiness)`;

    for (let week = 1; week <= 4; week++) {
      coverageA = Math.min(100, Math.round(coverageA + hoursScenarioA * 8));
      coverageB = Math.min(100, Math.round(coverageB + hoursScenarioB * 11));

      readinessA = Math.min(100, Math.round(readinessA + hoursScenarioA * 7));
      readinessB = Math.min(100, Math.round(readinessB + hoursScenarioB * 10));

      const entry = { week: `Week ${week}` };
      entry[keyA_ready] = readinessA;
      entry[keyB_ready] = readinessB;

      data.push(entry);
    }

    return { data, keyA_ready, keyB_ready };
  };

  const { data: chartData, keyA_ready, keyB_ready } = generateSimulationData();

  return (
    <div className="space-y-6">
      <div className="glass-panel border border-[#63C63D]/30 p-6 rounded-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4 text-[#FFD900]" />
          <span>Digital Twin Simulation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">What-if Study Simulator</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Simulate prospective study schedules to compare forecasted topic coverage, memory retention, and exam readiness estimates over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Scenario A Parameters">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                Daily Study Time: <span className="text-[#36A852] dark:text-[#63C63D] font-extrabold">{hoursScenarioA} Hours / Day</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={hoursScenarioA}
                onChange={(e) => setHoursScenarioA(Number(e.target.value))}
                className="w-full accent-[#63C63D] cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Baseline standard pace suitable for routine learning and revision.</p>
          </div>
        </Card>

        <Card title="Scenario B Parameters">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                Daily Study Time: <span className="text-[#B7E51D] font-extrabold">{hoursScenarioB} Hours / Day</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={hoursScenarioB}
                onChange={(e) => setHoursScenarioB(Number(e.target.value))}
                className="w-full accent-[#B7E51D] cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Accelerated pace focused on rapid topic coverage and intense revision.</p>
          </div>
        </Card>

        <Card title="Target Horizon">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                Days Until Exam: <span className="text-[#FFD900] font-extrabold">{examDays} Days</span>
              </label>
              <input
                type="range"
                min="7"
                max="90"
                step="7"
                value={examDays}
                onChange={(e) => setExamDays(Number(e.target.value))}
                className="w-full accent-[#FFD900] cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Simulates progression across four weekly milestones before exam date.</p>
          </div>
        </Card>
      </div>

      <Card title="Comparative 4-Week Readiness & Coverage Forecast" subtitle="Projected trajectories based on digital twin learning parameters">
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#060E08', borderColor: '#63C63D', borderRadius: '12px', fontSize: '12px', color: '#FFF' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey={keyA_ready} stroke="#63C63D" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey={keyB_ready} stroke="#FFD900" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

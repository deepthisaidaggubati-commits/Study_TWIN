import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Clock,
  HelpCircle,
  Brain,
  Award
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, dRes, qRes] = await Promise.all([
          API.get('/study-sessions/analytics'),
          API.get('/dashboard'),
          API.get('/quizzes/history')
        ]);
        if (aRes.data.success) setAnalytics(aRes.data.data);
        if (dRes.data.success) setDashboard(dRes.data.data);
        if (qRes.data.success) setQuizHistory(qRes.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner label="Compiling advanced learning analytics..." />;

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#10b981'];
  
  const masteryPieData = [
    { name: 'Low Mastery (0-40%)', value: dashboard?.masteryDistribution?.low || 0 },
    { name: 'Medium Mastery (41-70%)', value: dashboard?.masteryDistribution?.medium || 0 },
    { name: 'High Mastery (71-100%)', value: dashboard?.masteryDistribution?.high || 0 }
  ].filter(d => d.value > 0);

  const studyTypeData = analytics?.studyTypeDistribution
    ? Object.entries(analytics.studyTypeDistribution).map(([type, mins]) => ({ type, minutes: mins }))
    : [];

  const quizTrendData = quizHistory.slice(0, 10).reverse().map((q, idx) => ({
    attempt: `Quiz ${idx + 1}`,
    topic: q.topicName,
    score: q.score
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 rounded-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Longitudinal Intelligence Metrics</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Advanced Learning Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep behavioral insights into your study duration, quiz retention accuracy, mastery distribution, and peak productivity windows.
        </p>
      </div>

      {/* Top Analytics Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-indigo-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Study Time</p>
          <h3 className="text-3xl font-black text-white mt-1">{analytics?.totalMinutes || 0} mins</h3>
          <p className="text-[10px] text-slate-400 mt-2">{analytics?.totalSessions || 0} total session(s)</p>
        </Card>

        <Card className="border-violet-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Session Duration</p>
          <h3 className="text-3xl font-black text-white mt-1">{analytics?.avgDuration || 0} mins</h3>
          <p className="text-[10px] text-violet-400 font-semibold mt-2">Sustained Focus Metric</p>
        </Card>

        <Card className="border-emerald-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Most Studied Subject</p>
          <h3 className="text-xl font-bold text-white mt-2 truncate">{analytics?.mostStudiedSubject || 'None'}</h3>
          <p className="text-[10px] text-emerald-400 font-semibold mt-2">Top Curriculum Focus</p>
        </Card>

        <Card className="border-amber-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Most Studied Topic</p>
          <h3 className="text-xl font-bold text-white mt-2 truncate">{analytics?.mostStudiedTopic || 'None'}</h3>
          <p className="text-[10px] text-amber-400 font-semibold mt-2">Top Topic Focus</p>
        </Card>
      </div>

      {/* 2x2 Recharts Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Daily Study Time Heatmap / AreaChart */}
        <Card title="7-Day Daily Study Time Trend" subtitle="Minutes spent studying per day">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.weeklyActivityHeatmap || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dayName" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#analyticsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Topic Mastery Distribution Pie Chart */}
        <Card title="Curriculum Topic Mastery Distribution" subtitle="Proportion of topics across mastery tiers">
          <div className="h-64 w-full pt-2 flex items-center justify-center">
            {masteryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={masteryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {masteryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500">No mastery data calculated yet. Add topics & take quizzes!</div>
            )}
          </div>
        </Card>

        {/* 3. Quiz Score Trend Chart */}
        <Card title="Recent Quiz Accuracy Trend" subtitle="Scores across last 10 quiz attempts">
          <div className="h-64 w-full pt-4">
            {quizTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="attempt" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="score" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500 flex items-center justify-center h-full">No quiz attempt history available yet.</div>
            )}
          </div>
        </Card>

        {/* 4. Study Type Distribution */}
        <Card title="Study-Type Duration Breakdown" subtitle="Total focus minutes per study category">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="minutes" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

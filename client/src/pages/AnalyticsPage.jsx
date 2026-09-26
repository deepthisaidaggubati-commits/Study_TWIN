import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { BarChart3 } from 'lucide-react';

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

  // Green -> Lime -> Yellow Chart Palette
  const PIE_COLORS = ['#FFD900', '#63C63D', '#168F3B'];

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
      <div className="glass-panel border border-[#63C63D]/30 p-6 rounded-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] text-xs font-bold mb-2">
          <BarChart3 className="w-4 h-4 text-[#FFD900]" />
          <span>Longitudinal Intelligence Metrics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Advanced Learning Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Deep behavioral insights into your study duration, quiz retention accuracy, mastery distribution, and peak productivity windows.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#63C63D]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Study Time</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics?.totalMinutes || 0} mins</h3>
          <p className="text-[10px] text-[#36A852] dark:text-[#B7E51D] font-bold mt-2">{analytics?.totalSessions || 0} total session(s)</p>
        </Card>

        <Card className="border-[#B7E51D]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Session Duration</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics?.avgDuration || 0} mins</h3>
          <p className="text-[10px] text-[#B7E51D] font-bold mt-2">Sustained Focus Metric</p>
        </Card>

        <Card className="border-[#63C63D]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Most Studied Subject</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2 truncate">{analytics?.mostStudiedSubject || 'None'}</h3>
          <p className="text-[10px] text-[#36A852] dark:text-[#B7E51D] font-bold mt-2">Top Curriculum Focus</p>
        </Card>

        <Card className="border-[#FFD900]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Most Studied Topic</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2 truncate">{analytics?.mostStudiedTopic || 'None'}</h3>
          <p className="text-[10px] text-[#FFD900] font-bold mt-2">Top Topic Focus</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="7-Day Daily Study Time Trend" subtitle="Minutes spent studying per day">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.weeklyActivityHeatmap || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#63C63D" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#B7E51D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dayName" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#060E08', borderColor: '#63C63D', borderRadius: '12px', fontSize: '12px', color: '#FFF' }} />
                <Area type="monotone" dataKey="minutes" stroke="#63C63D" strokeWidth={3} fillOpacity={1} fill="url(#analyticsGreenGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

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
                  <Tooltip contentStyle={{ backgroundColor: '#060E08', borderColor: '#63C63D', borderRadius: '12px', fontSize: '12px', color: '#FFF' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">No mastery data calculated yet. Add topics & take quizzes!</div>
            )}
          </div>
        </Card>

        <Card title="Recent Quiz Accuracy Trend" subtitle="Scores across last 10 quiz attempts">
          <div className="h-64 w-full pt-4">
            {quizTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="attempt" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#060E08', borderColor: '#63C63D', borderRadius: '12px', fontSize: '12px', color: '#FFF' }} />
                  <Bar dataKey="score" fill="#63C63D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center h-full">No quiz attempt history available yet.</div>
            )}
          </div>
        </Card>

        <Card title="Study-Type Duration Breakdown" subtitle="Total focus minutes per study category">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#060E08', borderColor: '#63C63D', borderRadius: '12px', fontSize: '12px', color: '#FFF' }} />
                <Bar dataKey="minutes" fill="#B7E51D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

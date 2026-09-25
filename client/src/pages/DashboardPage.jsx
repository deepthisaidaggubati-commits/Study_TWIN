import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DashboardTwinHero from '../components/brand/DashboardTwinHero';
import { useAuth } from '../context/AuthContext';
import {
  Brain,
  Target,
  Flame,
  Clock,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  BookOpen,
  Layers,
  HelpCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Info
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="h-44 bg-slate-900 rounded-3xl border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-900 rounded-2xl border border-slate-800" />
          <div className="h-72 bg-slate-900 rounded-2xl border border-slate-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-950/40 border border-rose-800/60 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-12 shadow-2xl">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Dashboard Connection Error</h3>
        <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
        <Button variant="primary" size="md" onClick={fetchDashboard} className="space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading Dashboard</span>
        </Button>
      </div>
    );
  }

  const isNewUser = (data?.totalTopicsCount || 0) === 0;

  return (
    <div className="space-y-8">
      {/* 1. Header Hero Banner: Digital Twin Centerpiece */}
      <DashboardTwinHero
        user={user}
        dashboardData={data}
        onSync={fetchDashboard}
      />

      {/* 2. Top Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Overall Progress Card */}
        <Card className="border-violet-500/30 hover:border-violet-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Progress</p>
              <h3 className="text-3xl font-black text-white mt-1">{data?.overallProgress || 0}%</h3>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" style={{ width: `${data?.overallProgress || 0}%` }} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Estimated Exam Readiness Card */}
        <Card className="border-violet-500/30 hover:border-violet-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Readiness</p>
                <span className="text-[10px] text-violet-400 bg-violet-500/20 px-1.5 py-0.5 rounded font-bold">Model</span>
              </div>
              <h3 className="text-3xl font-black text-white mt-1">{data?.examReadiness || 0}%</h3>
              <p className="text-[10px] text-slate-400 mt-2">Estimated readiness metric</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Study Streak Card */}
        <Card className="border-amber-500/30 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Streak</p>
              <h3 className="text-3xl font-black text-white mt-1">{data?.currentStreak || 0} Days</h3>
              <p className="text-[10px] text-amber-400 font-semibold mt-2">Active Learning Momentum</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Today's Study Activity Card */}
        <Card className="border-emerald-500/30 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Activity</p>
              <h3 className="text-3xl font-black text-white mt-1">{data?.todayStudyTime || 0} mins</h3>
              <p className="text-[10px] text-slate-400 mt-2">
                {data?.todaySessionsCount || 0} session(s) • {data?.todayTopicsCount || 0} topic(s)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Quick Action Buttons Bar */}
      <Card title="Quick Actions" subtitle="Navigate directly to key workflow modules">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/sessions')} className="w-full flex flex-col py-3 space-y-1.5 border border-slate-700 hover:border-indigo-500">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold">Start Session</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/quiz')} className="w-full flex flex-col py-3 space-y-1.5 border border-slate-700 hover:border-violet-500">
            <HelpCircle className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold">Take Quiz</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/subjects')} className="w-full flex flex-col py-3 space-y-1.5 border border-slate-700 hover:border-emerald-500">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">Add Subject</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/topics')} className="w-full flex flex-col py-3 space-y-1.5 border border-slate-700 hover:border-amber-500">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">Add Topic</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/planner')} className="w-full flex flex-col py-3 space-y-1.5 border border-slate-700 hover:border-pink-500">
            <Calendar className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-semibold">View Plan</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/my-twin')} className="w-full flex flex-col py-3 space-y-1.5 border border-slate-700 hover:border-cyan-500">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold">View My Twin</span>
          </Button>
        </div>
      </Card>

      {/* 4. AI Recommendation Banner (Prominent "Recommended Next") */}
      <Card title="Recommended Next Activity" subtitle="Engine recommendation derived from forgetting risk, mastery & accuracy">
        {data?.recommendedNextActivity ? (
          <div className="p-6 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {data.recommendedNextActivity.recommendationType}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Priority: {data.recommendedNextActivity.priority}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">{data.recommendedNextActivity.topicName}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{data.recommendedNextActivity.reason}</p>
            </div>

            <div className="flex items-center space-x-4 self-end md:self-auto flex-shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Est. Duration</p>
                <p className="text-base font-extrabold text-white">{data.recommendedNextActivity.estimatedDuration} mins</p>
              </div>
              <Button variant="primary" size="md" onClick={() => navigate('/sessions')} className="space-x-2">
                <span>Start Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
            <Info className="w-6 h-6 text-indigo-400 mx-auto" />
            <p className="font-semibold text-slate-300">No pending recommendations right now.</p>
            <p>Add subjects, log study sessions, or take quizzes to generate recommendations!</p>
          </div>
        )}
      </Card>

      {/* 5. Main 2-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weekly Chart & Topic Mastery */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Study Time Analytics Chart */}
          <Card title="Weekly Study Analytics" subtitle="7-day study minutes history from real logs">
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.weeklyActivityHeatmap || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studyTimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dayName" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#12111a', borderColor: '#3b2d54', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value) => [`${value} mins`, 'Study Time']}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#studyTimeGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Weak Topics Section */}
          <Card title="Weak Topics Attention List" subtitle="Topics with mastery score < 50%">
            {data?.weakTopics?.length > 0 ? (
              <div className="space-y-3">
                {data.weakTopics.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{item.topicName}</h4>
                        <span className="text-[10px] font-semibold text-slate-400">({item.subjectName})</span>
                      </div>
                      <p className="text-xs text-amber-200/90 mt-1">{item.reason}</p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-400">{item.masteryScore}% Mastery</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate('/sessions')}>
                        Fix Weakness
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
                🎉 Excellent! No weak topics detected below 50% mastery.
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: High Risk & Upcoming Exams */}
        <div className="space-y-6">
          {/* High Forgetting Risk Section */}
          <Card title="High Forgetting-Risk Topics" subtitle="Topics requiring urgent memory revision">
            {data?.highRiskTopics?.length > 0 ? (
              <div className="space-y-3">
                {data.highRiskTopics.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 bg-rose-950/30 border border-rose-800/50 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white">{item.topicName}</h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.riskCategory} Risk
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Mastery: <strong className="text-slate-200">{item.masteryScore}%</strong></span>
                      <span>Forgetting Risk: <strong className="text-rose-400">{item.forgettingRisk}%</strong></span>
                    </div>

                    <p className="text-[11px] text-slate-300 bg-rose-950/50 p-2 rounded-lg font-medium border border-rose-900/40">
                      💡 {item.recommendedAction}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                No high forgetting-risk topics detected.
              </div>
            )}
          </Card>

          {/* Upcoming Exams Section */}
          <Card title="Upcoming Exams" subtitle="Target subject exam dates">
            {data?.upcomingExams?.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingExams.map(e => (
                  <div key={e.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{e.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(e.examDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-400">{e.daysRemaining} days left</span>
                      <p className={`text-[10px] font-semibold ${e.prepStatus === 'On Track' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {e.prepStatus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                No upcoming exam dates set. Add exam dates in Subjects!
              </div>
            )}
          </Card>

          {/* Recent Quiz Performance */}
          <Card title="Recent Quiz Performance" subtitle="Latest quiz scores">
            {data?.quizPerformance?.length > 0 ? (
              <div className="space-y-2.5">
                {data.quizPerformance.map(q => (
                  <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{q.topicName}</h4>
                      <p className="text-[10px] text-slate-500">{new Date(q.attemptedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-black ${q.score >= 80 ? 'text-emerald-400' : q.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {q.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                No quizzes attempted yet. Take a quiz to track performance!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

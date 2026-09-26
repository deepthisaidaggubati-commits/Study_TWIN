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
  RefreshCw,
  BookOpen,
  Layers,
  HelpCircle,
  Calendar,
  ArrowRight,
  Info
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
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
    return <LoadingSpinner label="Connecting to Digital Twin Intelligence Matrix..." />;
  }

  if (error) {
    return (
      <div className="p-8 glass-panel border border-rose-500/40 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-12 shadow-2xl">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Connection Error</h3>
        <p className="text-xs text-rose-400 leading-relaxed">{error}</p>
        <Button variant="primary" size="md" onClick={fetchDashboard} className="space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading Dashboard</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Dashboard Hero Banner (Green -> Lime -> Yellow) */}
      <DashboardTwinHero
        user={user}
        dashboardData={data}
        onSync={fetchDashboard}
      />

      {/* 2. Top Metric Cards Row (Green -> Lime -> Yellow) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Overall Progress Card */}
        <Card className="border-[#63C63D]/30 hover:border-[#63C63D]/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Progress</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{data?.overallProgress || 0}%</h3>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#168F3B] via-[#63C63D] to-[#B7E51D] h-full rounded-full transition-all duration-500"
                  style={{ width: `${data?.overallProgress || 0}%` }}
                />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#63C63D]/20 border border-[#63C63D]/40 flex items-center justify-center text-[#36A852] dark:text-[#B7E51D]">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Estimated Exam Readiness Card */}
        <Card className="border-[#B7E51D]/30 hover:border-[#B7E51D]/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exam Readiness</p>
                <span className="text-[10px] text-slate-950 font-black bg-[#B7E51D] px-1.5 py-0.5 rounded">AI Engine</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{data?.examReadiness || 0}%</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-semibold">Heuristic Readiness Model</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#B7E51D]/20 border border-[#B7E51D]/40 flex items-center justify-center text-[#63C63D] dark:text-[#B7E51D]">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Study Streak Card */}
        <Card className="border-[#FFD900]/30 hover:border-[#FFD900]/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Streak</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{data?.currentStreak || 0} Days</h3>
              <p className="text-[10px] text-[#FFD900] font-extrabold mt-2">Active Learning Momentum</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFD900]/20 border border-[#FFD900]/40 flex items-center justify-center text-[#FFD900]">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Today's Study Activity Card */}
        <Card className="border-[#168F3B]/30 hover:border-[#168F3B]/60 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Activity</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{data?.todayStudyTime || 0} mins</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {data?.todaySessionsCount || 0} session(s) • {data?.todayTopicsCount || 0} topic(s)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#168F3B]/20 border border-[#168F3B]/40 flex items-center justify-center text-[#36A852] dark:text-[#63C63D]">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Quick Action Buttons Bar */}
      <Card title="Quick Actions" subtitle="Direct access to core Twin learning workflows">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/sessions')} className="w-full flex flex-col py-3 space-y-1.5 border border-[#63C63D]/30 hover:border-[#63C63D]">
            <Clock className="w-4 h-4 text-[#36A852] dark:text-[#63C63D]" />
            <span className="text-xs font-bold">Start Session</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/quiz')} className="w-full flex flex-col py-3 space-y-1.5 border border-[#B7E51D]/30 hover:border-[#B7E51D]">
            <HelpCircle className="w-4 h-4 text-[#B7E51D]" />
            <span className="text-xs font-bold">Take Quiz</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/subjects')} className="w-full flex flex-col py-3 space-y-1.5 border border-[#63C63D]/30 hover:border-[#63C63D]">
            <BookOpen className="w-4 h-4 text-[#36A852] dark:text-[#63C63D]" />
            <span className="text-xs font-bold">Add Subject</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/topics')} className="w-full flex flex-col py-3 space-y-1.5 border border-[#FFD900]/30 hover:border-[#FFD900]">
            <Layers className="w-4 h-4 text-[#FFD900]" />
            <span className="text-xs font-bold">Add Topic</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/planner')} className="w-full flex flex-col py-3 space-y-1.5 border border-[#B7E51D]/30 hover:border-[#B7E51D]">
            <Calendar className="w-4 h-4 text-[#B7E51D]" />
            <span className="text-xs font-bold">View Plan</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={() => navigate('/my-twin')} className="w-full flex flex-col py-3 space-y-1.5 border border-[#63C63D]/30 hover:border-[#63C63D]">
            <Brain className="w-4 h-4 text-[#63C63D]" />
            <span className="text-xs font-bold">View My Twin</span>
          </Button>
        </div>
      </Card>

      {/* 4. AI Recommendation Banner (Green -> Lime -> Yellow) */}
      <Card title="Recommended Next Activity" subtitle="Engine recommendation derived from forgetting risk, mastery & accuracy">
        {data?.recommendedNextActivity ? (
          <div className="p-6 rounded-2xl glass-card border border-[#63C63D]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#168F3B]/20 text-[#168F3B] dark:text-[#B7E51D] border border-[#63C63D]/40">
                  {data.recommendedNextActivity.recommendationType}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFD900]/20 text-[#FFD900] border border-[#FFD900]/40">
                  Priority: {data.recommendedNextActivity.priority}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{data.recommendedNextActivity.topicName}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{data.recommendedNextActivity.reason}</p>
            </div>

            <div className="flex items-center space-x-4 self-end md:self-auto flex-shrink-0">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Est. Duration</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{data.recommendedNextActivity.estimatedDuration} mins</p>
              </div>
              <Button variant="primary" size="md" onClick={() => navigate('/sessions')} className="space-x-2">
                <span>Start Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center glass-card space-y-2 text-xs">
            <Info className="w-6 h-6 text-[#63C63D] mx-auto" />
            <p className="font-bold text-slate-900 dark:text-white">No pending recommendations right now.</p>
            <p className="text-slate-500 dark:text-slate-400">Add subjects, log study sessions, or take quizzes to generate recommendations!</p>
          </div>
        )}
      </Card>

      {/* 5. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Weekly Study Analytics" subtitle="7-day study minutes history (Green -> Lime -> Yellow)">
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.weeklyActivityHeatmap || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="greenLimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#63C63D" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#B7E51D" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dayName" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#060E08', borderColor: '#63C63D', borderRadius: '12px', fontSize: '12px', color: '#FFF' }}
                    formatter={(value) => [`${value} mins`, 'Study Time']}
                  />
                  <Area type="monotone" dataKey="minutes" stroke="#63C63D" strokeWidth={3} fillOpacity={1} fill="url(#greenLimeGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Weak Topics */}
          <Card title="Weak Topics Attention List" subtitle="Topics with mastery score < 50%">
            {data?.weakTopics?.length > 0 ? (
              <div className="space-y-3">
                {data.weakTopics.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 glass-card border-l-4 border-l-[#FFD900] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.topicName}</h4>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">({item.subjectName})</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{item.reason}</p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <span className="text-xs font-black text-[#FFD900]">{item.masteryScore}% Mastery</span>
                      <Button variant="outline" size="sm" onClick={() => navigate('/sessions')}>
                        Fix Weakness
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 glass-card">
                🎉 Excellent! No weak topics detected below 50% mastery.
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: High Risk & Upcoming Exams */}
        <div className="space-y-6">
          <Card title="High Forgetting-Risk Topics" subtitle="Topics requiring urgent revision">
            {data?.highRiskTopics?.length > 0 ? (
              <div className="space-y-3">
                {data.highRiskTopics.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 glass-card border-l-4 border-l-[#FFC400] space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.topicName}</h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FFD900]/20 text-[#FFD900] border border-[#FFD900]/30">
                        {item.riskCategory} Risk
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Mastery: <strong className="text-slate-900 dark:text-white">{item.masteryScore}%</strong></span>
                      <span>Forgetting Risk: <strong className="text-[#FFD900]">{item.forgettingRisk}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 glass-card">
                No high forgetting-risk topics detected.
              </div>
            )}
          </Card>

          {/* Upcoming Exams */}
          <Card title="Upcoming Exams" subtitle="Target exam countdown">
            {data?.upcomingExams?.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingExams.map(e => (
                  <div key={e.id} className="p-3.5 glass-card flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{e.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{new Date(e.examDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-[#63C63D] dark:text-[#B7E51D]">{e.daysRemaining} days left</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 glass-card">
                No upcoming exam dates set. Add exam dates in Subjects!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

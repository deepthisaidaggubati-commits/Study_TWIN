import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StudentTwinAvatar3D from '../components/brand/StudentTwinAvatar3D';
import { getTwinMessage, getTwinMotivationalNote } from '../components/brand/TwinMessageEngine';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Activity,
  Clock,
  Sparkles,
  Zap,
  Target,
  Flame,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Calendar,
  Layers,
  Info,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function MyTwinPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gender = user?.gender?.toLowerCase() || 'neutral';

  const fetchTwinData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load Digital Twin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTwinData();
  }, []);

  if (loading) return <LoadingSpinner label="Initializing Digital Twin Intelligence..." />;

  const overallProgress = data?.overallProgress || 0;
  const examReadiness = data?.examReadiness || 0;
  const streak = data?.currentStreak || 0;
  const highRiskTopics = data?.highRiskTopics || [];
  const weakTopics = data?.weakTopics || [];
  const recommendedNext = data?.recommendedNextActivity;

  const twinMsg = getTwinMessage(user, data);
  const twinNote = getTwinMotivationalNote(data);

  // Twin Visual State determination
  const getTwinState = () => {
    if (highRiskTopics.length > 0) return 'NEEDS_REVISION';
    if (weakTopics.length > 0) return 'NEEDS_ATTENTION';
    if (overallProgress >= 75) return 'STRONG_MOMENTUM';
    if (streak >= 3) return 'IMPROVING';
    return 'LEARNING';
  };

  const twinState = getTwinState();

  return (
    <div className="space-y-8">
      {/* 1. Flagship Hero Banner: Large Digital Twin & Neural Intelligence Matrix */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-teal-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-teal-500/20 via-purple-600/20 to-pink-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-amber-400/20 via-teal-300/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Twin Identity & Live Neural Dialogue */}
          <div className="space-y-5 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-pill border border-teal-500/40">
              <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
              <span className="text-xs font-black bg-gradient-to-r from-teal-400 via-purple-400 to-amber-300 bg-clip-text text-transparent uppercase tracking-widest">
                DIGITAL TWIN AI • MAIN CHARACTER ENGINE
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Meet Your AI Twin, <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">{user?.name || 'Student'}</span>
            </h1>

            {/* Twin Dialogue Card */}
            <div className="p-5 rounded-2xl glass-card border-l-4 border-l-teal-400 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-500 dark:text-teal-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-amber-400 inline" />
                  <span>TWIN STATUS: {twinState.replace('_', ' ')}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                  REAL DATA SYNCED
                </span>
              </div>

              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                "{twinMsg.dialogue}"
              </p>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 pt-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 inline" />
                <span>{twinMsg.highlight}</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Button variant="primary" size="md" onClick={() => navigate('/sessions')} className="space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Start Session With Twin</span>
              </Button>

              <Button variant="outline" size="md" onClick={() => navigate('/quiz')} className="space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>Take Adaptive Quiz</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Large 3D-Style Digital Student Companion */}
          <div className="relative flex-shrink-0 p-6 rounded-3xl glass-card border border-teal-500/30 flex items-center justify-center">
            <StudentTwinAvatar3D
              gender={gender}
              size="hero"
              animated
              state={twinState}
            />
          </div>
        </div>
      </div>

      {/* 2. Core Intelligence Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-teal-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Topic Mastery</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{overallProgress}%</h3>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-2">Calibrated across {data?.totalTopicsCount || 0} topic(s)</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exam Readiness</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{examReadiness}%</h3>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-2">Heuristic Readiness Engine</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Streak</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{streak} Days</h3>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-2">Consistency Momentum</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-pink-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Forgetting Risk</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{highRiskTopics.length} Topics</h3>
              <p className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold mt-2">Require Immediate Revision</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Requirement 23: "Why is my Twin saying this?" Explanation Card */}
      <Card title="Why is my Twin saying this?" subtitle="Transparent data breakdown explaining your Twin's advice">
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-pill space-y-2 border border-teal-500/30">
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 dark:text-teal-300">
              <Info className="w-4 h-4 text-teal-400" />
              <span>BEHAVIORAL MODEL ANALYSIS</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Your Digital Twin computes your retention curve by combining <strong>study session frequency</strong>, <strong>quiz accuracy</strong>, and <strong>days since last revision</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Mastery Score</span>
                <span className="text-sm font-black text-teal-600 dark:text-teal-300">{overallProgress}%</span>
                <p className="text-[10px] text-slate-400">Accuracy & quiz performance</p>
              </div>

              <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">High-Risk Count</span>
                <span className="text-sm font-black text-pink-600 dark:text-pink-400">{highRiskTopics.length}</span>
                <p className="text-[10px] text-slate-400">Topics unrevised &gt; 5 days</p>
              </div>

              <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Target Readiness</span>
                <span className="text-sm font-black text-purple-600 dark:text-purple-300">{examReadiness}%</span>
                <p className="text-[10px] text-slate-400">Readiness heuristic formula</p>
              </div>
            </div>
          </div>

          {/* Motivational Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-pink-500/10 border border-teal-500/30 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300">
                {twinNote.author}
              </span>
              <p className="text-xs font-semibold italic text-slate-800 dark:text-slate-200 mt-1">"{twinNote.quote}"</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Complete Topic Mastery & Forgetting Risk Matrix */}
      <Card title="Topic Mastery & Forgetting Risk Matrix" subtitle="Calibrated memory profiles for every enrolled topic">
        {data?.topicMasteryList?.length > 0 ? (
          <div className="space-y-3">
            {data.topicMasteryList.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.topicName}</h4>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">({item.subjectName})</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Accuracy: {item.accuracy}% • Attempts: {item.attempts} • Days since revised: {item.daysSinceLastRevised !== null ? item.daysSinceLastRevised : 'Never'}
                  </p>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-300 block">Mastery: {item.masteryScore}%</span>
                    <span className={`text-[10px] font-bold ${item.forgettingRisk >= 60 ? 'text-pink-500' : 'text-slate-400'}`}>
                      Risk: {item.forgettingRisk}%
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/sessions')}>
                    Revise Topic
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 glass-card">
            No topic mastery records found. Add subjects and topics to activate your Twin's memory matrix!
          </div>
        )}
      </Card>
    </div>
  );
}

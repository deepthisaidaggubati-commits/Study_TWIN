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
  Sparkles,
  Zap,
  Target,
  Flame,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Info
} from 'lucide-react';

export default function MyTwinPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const gender = user?.gender?.toLowerCase() || 'neutral';

  const fetchTwinData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      // Handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTwinData();
  }, []);

  if (loading) return <LoadingSpinner label="Calibrating Digital Twin Intelligence Matrix..." />;

  const overallProgress = data?.overallProgress || 0;
  const examReadiness = data?.examReadiness || 0;
  const streak = data?.currentStreak || 0;
  const highRiskTopics = data?.highRiskTopics || [];
  const weakTopics = data?.weakTopics || [];

  const twinMsg = getTwinMessage(user, data);
  const twinNote = getTwinMotivationalNote(data);

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
      {/* 1. Flagship Hero Banner: Green -> Lime -> Yellow Theme */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-10 border border-[#63C63D]/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#168F3B]/25 via-[#63C63D]/20 to-[#B7E51D]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#FFD900]/20 via-[#B7E51D]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-5 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#63C63D]/40">
              <Sparkles className="w-4 h-4 text-[#FFD900] animate-pulse" />
              <span className="text-xs font-black bg-gradient-to-r from-[#168F3B] via-[#63C63D] via-[#B7E51D] to-[#FFD900] bg-clip-text text-transparent uppercase tracking-widest">
                DIGITAL TWIN AI • MAIN CHARACTER ENGINE
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Meet Your AI Twin, <span className="bg-gradient-to-r from-[#36A852] via-[#B7E51D] to-[#FFD900] bg-clip-text text-transparent">{user?.name || 'Student'}</span>
            </h1>

            {/* Dialogue Card */}
            <div className="p-5 rounded-2xl glass-card border-l-4 border-l-[#63C63D] space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#168F3B] dark:text-[#B7E51D] uppercase tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-[#FFD900] inline" />
                  <span>TWIN STATUS: {twinState.replace('_', ' ')}</span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D]">
                  REAL DATA SYNCED
                </span>
              </div>

              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                "{twinMsg.dialogue}"
              </p>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 pt-1">
                <Zap className="w-3.5 h-3.5 text-[#FFD900] inline" />
                <span>{twinMsg.highlight}</span>
              </p>
            </div>

            {/* Action Buttons */}
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

          {/* 3D Student Companion */}
          <div className="relative flex-shrink-0 p-6 rounded-3xl glass-card border border-[#63C63D]/30 flex items-center justify-center">
            <StudentTwinAvatar3D
              gender={gender}
              size="hero"
              animated
              state={twinState}
            />
          </div>
        </div>
      </div>

      {/* 2. Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#63C63D]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Topic Mastery</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{overallProgress}%</h3>
              <p className="text-[10px] text-[#36A852] dark:text-[#B7E51D] font-bold mt-2">Across {data?.totalTopicsCount || 0} topic(s)</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#63C63D]/20 border border-[#63C63D]/40 flex items-center justify-center text-[#63C63D]">
              <Brain className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-[#B7E51D]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exam Readiness</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{examReadiness}%</h3>
              <p className="text-[10px] text-[#B7E51D] font-bold mt-2">Heuristic Readiness Engine</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#B7E51D]/20 border border-[#B7E51D]/40 flex items-center justify-center text-[#B7E51D]">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-[#FFD900]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Streak</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{streak} Days</h3>
              <p className="text-[10px] text-[#FFD900] font-bold mt-2">Consistency Momentum</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFD900]/20 border border-[#FFD900]/40 flex items-center justify-center text-[#FFD900]">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-[#FFC400]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Forgetting Risk</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{highRiskTopics.length} Topics</h3>
              <p className="text-[10px] text-[#FFC400] font-bold mt-2">Require Revision</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFC400]/20 border border-[#FFC400]/40 flex items-center justify-center text-[#FFC400]">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. "Why is my Twin saying this?" Explanation Card */}
      <Card title="Why is my Twin saying this?" subtitle="Transparent data breakdown explaining your Twin's recommendation">
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-pill space-y-2 border border-[#63C63D]/30">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#168F3B] dark:text-[#B7E51D]">
              <Info className="w-4 h-4 text-[#63C63D]" />
              <span>BEHAVIORAL MODEL ANALYSIS</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Your Digital Twin computes your retention curve by combining <strong>study session frequency</strong>, <strong>quiz accuracy</strong>, and <strong>days since last revision</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl glass-card border border-[#63C63D]/30">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Mastery Score</span>
                <span className="text-sm font-black text-[#168F3B] dark:text-[#B7E51D]">{overallProgress}%</span>
              </div>

              <div className="p-3 rounded-xl glass-card border border-[#FFD900]/30">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">High-Risk Count</span>
                <span className="text-sm font-black text-[#FFD900]">{highRiskTopics.length}</span>
              </div>

              <div className="p-3 rounded-xl glass-card border border-[#63C63D]/30">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Target Readiness</span>
                <span className="text-sm font-black text-[#36A852] dark:text-[#63C63D]">{examReadiness}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#168F3B]/10 via-[#63C63D]/10 to-[#FFD900]/10 border border-[#63C63D]/30 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D]">
                {twinNote.author}
              </span>
              <p className="text-xs font-bold italic text-slate-800 dark:text-slate-200 mt-1">"{twinNote.quote}"</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

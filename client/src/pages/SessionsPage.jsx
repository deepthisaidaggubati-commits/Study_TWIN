import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  Clock,
  Play,
  Pause,
  Square,
  CheckCircle,
  Plus,
  BookOpen,
  Layers,
  Flame,
  Award,
  Filter,
  Trash2,
  RefreshCw,
  Sparkles,
  BarChart2
} from 'lucide-react';

export default function SessionsPage() {
  const toast = useToast();

  // Data states
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states for history table
  const [filterSubject, setFilterSubject] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterType, setFilterType] = useState('');

  // Form selection state
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formTopicId, setFormTopicId] = useState('');
  const [formStudyType, setFormStudyType] = useState('Learning');
  const [formNotes, setFormNotes] = useState('');

  // Active Timer state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [completedSummary, setCompletedSummary] = useState(null);

  const timerRef = useRef(null);

  // 1. Restore active timer session from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('studytwin_active_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isSessionActive) {
          setFormSubjectId(parsed.subjectId || '');
          setFormTopicId(parsed.topicId || '');
          setFormStudyType(parsed.studyType || 'Learning');
          setFormNotes(parsed.notes || '');
          setSessionStartTime(parsed.startTime ? new Date(parsed.startTime) : new Date());

          let currentElapsed = parsed.elapsedSeconds || 0;
          if (!parsed.isPaused && parsed.lastTimestamp) {
            const deltaSecs = Math.floor((Date.now() - parsed.lastTimestamp) / 1000);
            currentElapsed += Math.max(0, deltaSecs);
          }

          setElapsedSeconds(currentElapsed);
          setIsPaused(parsed.isPaused || false);
          setIsSessionActive(true);
        }
      } catch (err) {
        localStorage.removeItem('studytwin_active_session');
      }
    }
  }, []);

  // 2. Timer Tick interval
  useEffect(() => {
    if (isSessionActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isSessionActive, isPaused]);

  // 3. Persist timer state to localStorage whenever tick or state changes
  useEffect(() => {
    if (isSessionActive) {
      localStorage.setItem('studytwin_active_session', JSON.stringify({
        isSessionActive,
        isPaused,
        elapsedSeconds,
        startTime: sessionStartTime,
        subjectId: formSubjectId,
        topicId: formTopicId,
        studyType: formStudyType,
        notes: formNotes,
        lastTimestamp: Date.now()
      }));
    } else {
      localStorage.removeItem('studytwin_active_session');
    }
  }, [isSessionActive, isPaused, elapsedSeconds, formSubjectId, formTopicId, formStudyType, formNotes, sessionStartTime]);

  // Fetch all initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, topRes, sessRes, analyticsRes] = await Promise.all([
        API.get('/subjects'),
        API.get('/topics'),
        API.get('/study-sessions'),
        API.get('/study-sessions/analytics')
      ]);

      if (subRes.data.success) setSubjects(subRes.data.data);
      if (topRes.data.success) setTopics(topRes.data.data);
      if (sessRes.data.success) setSessions(sessRes.data.data);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
    } catch (err) {
      toast.error('Failed to load study session metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Timer Controls
  const handleStartSession = (e) => {
    e.preventDefault();
    if (!formSubjectId || !formTopicId) {
      return toast.error('Please select both a Subject and a Topic.');
    }

    setElapsedSeconds(0);
    setSessionStartTime(new Date());
    setIsPaused(false);
    setIsSessionActive(true);
    setCompletedSummary(null);
    toast.info('Study session timer started!');
  };

  const handlePauseSession = () => {
    setIsPaused(true);
    toast.info('Timer paused.');
  };

  const handleResumeSession = () => {
    setIsPaused(false);
    toast.info('Timer resumed.');
  };

  const handleEndSession = async () => {
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));

    try {
      const selectedSub = subjects.find(s => s._id === formSubjectId);
      const selectedTop = topics.find(t => t._id === formTopicId);

      const res = await API.post('/study-sessions', {
        subjectId: formSubjectId,
        topicId: formTopicId,
        duration: durationMins,
        studyType: formStudyType,
        notes: formNotes,
        startTime: sessionStartTime || new Date(Date.now() - durationMins * 60000),
        endTime: new Date()
      });

      if (res.data.success) {
        setIsSessionActive(false);
        setIsPaused(false);
        localStorage.removeItem('studytwin_active_session');

        setCompletedSummary({
          duration: durationMins,
          subjectName: selectedSub?.name || 'Subject',
          topicName: selectedTop?.name || 'Topic',
          studyType: formStudyType,
          notes: formNotes
        });

        toast.success(`Session Completed! Saved ${durationMins} minute(s).`);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save study session.');
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session log?')) return;
    try {
      await API.delete(`/study-sessions/${id}`);
      toast.success('Session record deleted.');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete session.');
    }
  };

  // Helper format HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTopics = topics.filter(t => t.subjectId?._id === formSubjectId || t.subjectId === formSubjectId);

  // History filtering
  const filteredSessions = sessions.filter(s => {
    if (filterSubject && (s.subjectId?._id !== filterSubject && s.subjectId !== filterSubject)) return false;
    if (filterTopic && (s.topicId?._id !== filterTopic && s.topicId !== filterTopic)) return false;
    if (filterType && s.studyType !== filterType) return false;
    return true;
  });

  if (loading) return <LoadingSpinner label="Querying study session history & analytics..." />;

  const activeSubjectName = subjects.find(s => s._id === formSubjectId)?.name || 'Subject';
  const activeTopicName = topics.find(t => t._id === formTopicId)?.name || 'Topic';

  return (
    <div className="space-y-8">
      {/* 1. Header & Live Session Timer Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Session Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">Live time tracking, session history logs, and retention analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Current Streak: {analytics?.currentStreak || 0} Day(s)</span>
          </div>
        </div>
      </div>

      {/* 2. Active Session / Before Starting Form Container */}
      <Card title={isSessionActive ? "Active Study Session" : completedSummary ? "Session Completed" : "Start New Study Session"}>
        {completedSummary ? (
          <div className="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Session Completed!</h3>
            <div className="max-w-md mx-auto p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 text-left">
              <div className="flex justify-between"><span className="text-slate-400">Duration:</span><strong className="text-white font-bold">{completedSummary.duration} Minutes</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Subject:</span><strong className="text-white">{completedSummary.subjectName}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Topic:</span><strong className="text-white">{completedSummary.topicName}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Study Type:</span><strong className="text-indigo-400">{completedSummary.studyType}</strong></div>
              {completedSummary.notes && <div className="pt-2 border-t border-slate-800"><span className="text-slate-400 block mb-1">Notes:</span><p className="text-slate-200 italic">{completedSummary.notes}</p></div>}
            </div>
            <Button variant="primary" size="md" onClick={() => setCompletedSummary(null)}>
              Start Another Session
            </Button>
          </div>
        ) : isSessionActive ? (
          <div className="p-8 bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/40 rounded-2xl text-center space-y-6 shadow-2xl">
            {/* Active Session Subject & Topic Breadcrumb */}
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-indigo-300">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">{activeSubjectName}</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-white">{activeTopicName}</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{formStudyType}</span>
            </div>

            {/* Live Clock Display */}
            <div className="py-4">
              <div className="text-5xl sm:text-7xl font-black text-white tracking-widest font-mono select-none drop-shadow-lg">
                {formatTime(elapsedSeconds)}
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2">
                {isPaused ? '⏸ Timer Paused' : '⚡ Live Study Session in Progress'}
              </p>
            </div>

            {/* Notes Textarea */}
            <div className="max-w-lg mx-auto text-left">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Session Notes & Key Concepts
              </label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Write down formulas, notes, key learnings..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 h-20 resize-none"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 pt-2">
              {isPaused ? (
                <Button variant="primary" size="lg" onClick={handleResumeSession} className="space-x-2">
                  <Play className="w-5 h-5 fill-current" />
                  <span>Resume Timer</span>
                </Button>
              ) : (
                <Button variant="secondary" size="lg" onClick={handlePauseSession} className="space-x-2">
                  <Pause className="w-5 h-5" />
                  <span>Pause Timer</span>
                </Button>
              )}

              <Button variant="danger" size="lg" onClick={handleEndSession} className="space-x-2">
                <Square className="w-5 h-5 fill-current" />
                <span>End & Save Session</span>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStartSession} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Subject</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => { setFormSubjectId(e.target.value); setFormTopicId(''); }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Topic</label>
                <select
                  value={formTopicId}
                  onChange={(e) => setFormTopicId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                  disabled={!formSubjectId}
                >
                  <option value="">-- Select Topic --</option>
                  {filteredTopics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Study Type</label>
                <select
                  value={formStudyType}
                  onChange={(e) => setFormStudyType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Learning">Learning</option>
                  <option value="Revision">Revision</option>
                  <option value="Practice">Practice</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Coding">Coding</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="lg" className="space-x-2">
                <Play className="w-5 h-5 fill-current" />
                <span>Start Study Session</span>
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* 3. Study Analytics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-indigo-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Study Time</p>
          <h3 className="text-3xl font-black text-white mt-1">{analytics?.todayMinutes || 0} mins</h3>
          <p className="text-[10px] text-slate-400 mt-2">Daily Focus Time</p>
        </Card>

        <Card className="border-violet-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Study Time</p>
          <h3 className="text-3xl font-black text-white mt-1">{analytics?.weeklyMinutes || 0} mins</h3>
          <p className="text-[10px] text-slate-400 mt-2">7-Day Cumulative</p>
        </Card>

        <Card className="border-emerald-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Study Time</p>
          <h3 className="text-3xl font-black text-white mt-1">{analytics?.monthlyMinutes || 0} mins</h3>
          <p className="text-[10px] text-slate-400 mt-2">30-Day Cumulative</p>
        </Card>

        <Card className="border-amber-500/30">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Session Duration</p>
          <h3 className="text-3xl font-black text-white mt-1">{analytics?.avgDuration || 0} mins</h3>
          <p className="text-[10px] text-amber-400 font-semibold mt-2">Longest Streak: {analytics?.longestStreak || 0} days</p>
        </Card>
      </div>

      {/* 4. Session History & Filter Table */}
      <Card title="Session History & Logs" subtitle="Filter and view past study sessions">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 bg-slate-900 rounded-xl border border-slate-800">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Subject</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Topic</label>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Study Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
            >
              <option value="">All Types</option>
              <option value="Learning">Learning</option>
              <option value="Revision">Revision</option>
              <option value="Practice">Practice</option>
              <option value="Quiz">Quiz</option>
              <option value="Coding">Coding</option>
            </select>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filteredSessions.map(s => (
            <div key={s._id} className="flex items-center justify-between p-4 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{s.topicId?.name || 'Topic'}</h4>
                  <p className="text-xs text-slate-400">{s.subjectId?.name || 'Subject'} • <span className="text-indigo-300 font-semibold">{s.studyType}</span></p>
                  {s.notes && <p className="text-[11px] text-slate-500 italic mt-1">"{s.notes}"</p>}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{s.duration} mins</span>
                  <p className="text-[10px] text-slate-500">{new Date(s.startTime).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDeleteSession(s._id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
              <Clock className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="font-semibold text-slate-300">No study sessions yet.</p>
              <p className="text-xs">Start your first session to begin building your StudyTwin!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

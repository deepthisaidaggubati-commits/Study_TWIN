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
  Flame,
  Trash2,
  Sparkles
} from 'lucide-react';

export default function SessionsPage() {
  const toast = useToast();

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterSubject, setFilterSubject] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterType, setFilterType] = useState('');

  const [formSubjectId, setFormSubjectId] = useState('');
  const [formTopicId, setFormTopicId] = useState('');
  const [formStudyType, setFormStudyType] = useState('Learning');
  const [formNotes, setFormNotes] = useState('');

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [completedSummary, setCompletedSummary] = useState(null);

  const timerRef = useRef(null);

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

  useEffect(() => {
    if (isSessionActive) {
      localStorage.setItem('studytwin_active_session', JSON.stringify({
        isSessionActive: true,
        isPaused,
        elapsedSeconds,
        subjectId: formSubjectId,
        topicId: formTopicId,
        studyType: formStudyType,
        notes: formNotes,
        startTime: sessionStartTime,
        lastTimestamp: Date.now()
      }));
    } else {
      localStorage.removeItem('studytwin_active_session');
    }
  }, [isSessionActive, isPaused, elapsedSeconds, formSubjectId, formTopicId, formStudyType, formNotes, sessionStartTime]);

  const fetchSessionData = async () => {
    setLoading(true);
    try {
      const [subsRes, topsRes, sessRes, statsRes] = await Promise.all([
        API.get('/subjects').catch(() => ({ data: { success: false, data: [] } })),
        API.get('/topics').catch(() => ({ data: { success: false, data: [] } })),
        API.get('/study-sessions').catch(() => ({ data: { success: false, data: [] } })),
        API.get('/study-sessions/stats').catch(() => ({ data: { success: false, data: null } }))
      ]);

      if (subsRes.data.success) setSubjects(subsRes.data.data || []);
      if (topsRes.data.success) setTopics(topsRes.data.data || []);
      if (sessRes.data.success) setSessions(sessRes.data.data || []);
      if (statsRes.data.success) setAnalytics(statsRes.data.data);
    } catch (err) {
      toast.error('Error loading study session data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  const filteredTopics = topics.filter(t => !formSubjectId || (t.subjectId?._id || t.subjectId) === formSubjectId);

  const handleStartSession = (e) => {
    e.preventDefault();
    if (!formSubjectId || !formTopicId) {
      return toast.error('Please select both a Subject and a Topic to start.');
    }

    setElapsedSeconds(0);
    setSessionStartTime(new Date());
    setIsPaused(false);
    setIsSessionActive(true);
    setCompletedSummary(null);
    toast.success('Study Timer Started! Keep focusing.');
  };

  const handlePauseSession = () => setIsPaused(true);
  const handleResumeSession = () => setIsPaused(false);

  const handleStopAndSaveSession = async () => {
    const finalMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    try {
      const res = await API.post('/study-sessions', {
        subjectId: formSubjectId,
        topicId: formTopicId,
        startTime: sessionStartTime,
        endTime: new Date(),
        duration: finalMinutes,
        studyType: formStudyType,
        notes: formNotes
      });

      if (res.data.success) {
        toast.success(`Study session saved! +${finalMinutes} minutes recorded.`);
        const selSub = subjects.find(s => s._id === formSubjectId);
        const selTop = topics.find(t => t._id === formTopicId);

        setCompletedSummary({
          duration: finalMinutes,
          subjectName: selSub?.name || 'Subject',
          topicName: selTop?.name || 'Topic',
          studyType: formStudyType,
          notes: formNotes
        });

        setIsSessionActive(false);
        setIsPaused(false);
        setElapsedSeconds(0);
        setFormNotes('');
        fetchSessionData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save study session.');
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session log?')) return;
    try {
      await API.delete(`/study-sessions/${id}`);
      toast.success('Study session deleted.');
      fetchSessionData();
    } catch (err) {
      toast.error('Failed to delete session.');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredSessions = sessions.filter(s => {
    if (filterSubject && (s.subjectId?._id || s.subjectId) !== filterSubject) return false;
    if (filterTopic && (s.topicId?._id || s.topicId) !== filterTopic) return false;
    if (filterType && s.studyType !== filterType) return false;
    return true;
  });

  const activeSubjectName = subjects.find(s => s._id === formSubjectId)?.name || 'Selected Subject';
  const activeTopicName = topics.find(t => t._id === formTopicId)?.name || 'Selected Topic';

  if (loading) return <LoadingSpinner label="Initializing Study Session Engine..." />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel border border-[#63C63D]/30 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Study Session Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live time tracking, session history logs, and retention analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#63C63D]/10 border border-[#63C63D]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#168F3B] dark:text-[#B7E51D]">
            <Flame className="w-4 h-4 text-[#FFD900] animate-pulse" />
            <span>Current Streak: {analytics?.currentStreak || 0} Day(s)</span>
          </div>
        </div>
      </div>

      {/* Active Session Form / Timer */}
      <Card title={isSessionActive ? "Active Study Session" : completedSummary ? "Session Completed" : "Start New Study Session"}>
        {completedSummary ? (
          <div className="p-6 glass-card border border-[#63C63D]/40 rounded-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#63C63D]/20 text-[#36A852] dark:text-[#B7E51D] flex items-center justify-center mx-auto border border-[#63C63D]/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Session Completed!</h3>
            <div className="max-w-md mx-auto p-4 glass-pill space-y-2 text-xs text-slate-700 dark:text-slate-300 text-left">
              <div className="flex justify-between"><span>Duration:</span><strong className="text-slate-900 dark:text-white font-bold">{completedSummary.duration} Minutes</strong></div>
              <div className="flex justify-between"><span>Subject:</span><strong className="text-slate-900 dark:text-white">{completedSummary.subjectName}</strong></div>
              <div className="flex justify-between"><span>Topic:</span><strong className="text-slate-900 dark:text-white">{completedSummary.topicName}</strong></div>
              <div className="flex justify-between"><span>Study Type:</span><strong className="text-[#36A852] dark:text-[#B7E51D]">{completedSummary.studyType}</strong></div>
              {completedSummary.notes && <div className="pt-2 border-t border-slate-200/20 dark:border-slate-800/40"><span className="text-slate-400 block mb-1">Notes:</span><p className="italic">{completedSummary.notes}</p></div>}
            </div>
            <Button variant="primary" size="md" onClick={() => setCompletedSummary(null)}>
              Start Another Session
            </Button>
          </div>
        ) : isSessionActive ? (
          <div className="p-8 glass-panel border border-[#63C63D]/40 rounded-2xl text-center space-y-6 shadow-2xl">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[#168F3B] dark:text-[#B7E51D]">
              <span className="px-2.5 py-1 rounded-full bg-[#63C63D]/20 border border-[#63C63D]/30">{activeSubjectName}</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-full bg-[#B7E51D]/20 text-[#168F3B] dark:text-[#B7E51D]">{activeTopicName}</span>
              <span>→</span>
              <span className="px-2.5 py-1 rounded-full bg-[#FFD900]/20 text-[#FFD900]">{formStudyType}</span>
            </div>

            <div className="py-4">
              <div className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-widest font-mono select-none drop-shadow-lg">
                {formatTime(elapsedSeconds)}
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">
                {isPaused ? '⏸ Timer Paused' : '⚡ Live Study Session in Progress'}
              </p>
            </div>

            <div className="max-w-lg mx-auto text-left">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Session Notes & Key Concepts
              </label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Write down formulas, notes, key learnings..."
                className="w-full glass-input rounded-xl p-3 text-xs focus:outline-none h-20 resize-none font-medium"
              />
            </div>

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

              <Button variant="important" size="lg" onClick={handleStopAndSaveSession} className="space-x-2">
                <Square className="w-5 h-5 fill-current" />
                <span>Finish & Save Session</span>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleStartSession} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select Subject</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => {
                    setFormSubjectId(e.target.value);
                    setFormTopicId('');
                  }}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-semibold"
                  required
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select Topic</label>
                <select
                  value={formTopicId}
                  onChange={(e) => setFormTopicId(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-semibold"
                  required
                  disabled={!formSubjectId}
                >
                  <option value="">-- Select Topic --</option>
                  {filteredTopics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Study Type</label>
                <select
                  value={formStudyType}
                  onChange={(e) => setFormStudyType(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-semibold"
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

      {/* Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-[#63C63D]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Study Time</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics?.todayMinutes || 0} mins</h3>
        </Card>

        <Card className="border-[#B7E51D]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weekly Study Time</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics?.weeklyMinutes || 0} mins</h3>
        </Card>

        <Card className="border-[#36A852]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monthly Study Time</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics?.monthlyMinutes || 0} mins</h3>
        </Card>

        <Card className="border-[#FFD900]/30">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Session Duration</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{analytics?.avgDuration || 0} mins</h3>
        </Card>
      </div>

      {/* History */}
      <Card title="Session History & Logs" subtitle="Filter and view past study sessions">
        <div className="space-y-3">
          {filteredSessions.map(s => (
            <div key={s._id} className="flex items-center justify-between p-4 glass-card">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.topicId?.name || 'Topic'}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.subjectId?.name || 'Subject'} • <span className="text-[#36A852] dark:text-[#B7E51D] font-bold">{s.studyType}</span></p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 dark:text-white">{s.duration} mins</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(s.startTime).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDeleteSession(s._id)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

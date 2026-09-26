import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StudentTwinAvatar3D from '../components/brand/StudentTwinAvatar3D';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  BookOpen,
  Layers,
  Check
} from 'lucide-react';

export default function QuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [quizzes, setQuizzes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const gender = user?.gender?.toLowerCase() || 'neutral';

  const fetchQuizSystemData = async () => {
    setLoading(true);
    try {
      const [quizRes, topicRes] = await Promise.all([
        API.get('/quizzes').catch(() => ({ data: { success: false, data: [] } })),
        API.get('/topics').catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (quizRes.data.success) {
        setQuizzes(quizRes.data.data || []);
      }
      if (topicRes.data.success) {
        setTopics(topicRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to initialize quiz system.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizSystemData();
  }, []);

  const handleGenerateAdaptiveQuiz = async (topicId) => {
    setGenerating(true);
    try {
      const res = await API.post('/quizzes/generate', { topicId });
      if (res.data.success) {
        const newQuiz = res.data.data;
        toast.success(`Your Twin prepared an adaptive quiz for ${newQuiz.topicId?.name || 'Topic'}!`);
        fetchQuizSystemData();
        handleStartQuiz(newQuiz);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate adaptive quiz.');
    } finally {
      setGenerating(false);
    }
  };

  const handleStartQuiz = (q) => {
    setActiveQuiz(q);
    setCurrentQuestionIdx(0);
    setAnswers(new Array(q.questions.length).fill(null));
    setResult(null);
  };

  const handleSelectOption = (optIdx) => {
    const updated = [...answers];
    updated[currentQuestionIdx] = optIdx;
    setAnswers(updated);
  };

  const handleSubmitQuiz = async () => {
    if (answers.some(a => a === null)) {
      return toast.error('Please answer all questions before submitting.');
    }

    setSubmitting(true);
    try {
      const res = await API.post(`/quizzes/${activeQuiz._id}/attempt`, {
        answers,
        timeTaken: 45
      });
      if (res.data.success) {
        setResult(res.data.data);
        toast.success(`Quiz Completed! Score: ${res.data.data.score}%`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Calibrating Digital Twin Adaptive Quiz System..." />;
  }

  const hasNoData = quizzes.length === 0 && topics.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#168F3B] dark:text-[#B7E51D]">
            <Sparkles className="w-4 h-4 text-[#FFD900] animate-pulse" />
            <span>ADAPTIVE ASSESSMENT ENVIRONMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Digital Twin Adaptive Quizzes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test memory retention, calibrate topic mastery, and reduce forgetting risk
          </p>
        </div>

        {topics.length > 0 && !activeQuiz && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleGenerateAdaptiveQuiz(topics[0]._id)}
            loading={generating}
            className="space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Quiz</span>
          </Button>
        )}
      </div>

      {/* REQUIREMENT 17: Transparent Twin Interaction when No Data Exists */}
      {hasNoData ? (
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-[#63C63D]/30 text-center space-y-6 max-w-2xl mx-auto my-6 shadow-2xl">
          <div className="flex justify-center">
            <div className="p-4 rounded-3xl glass-card border border-[#63C63D]/30">
              <StudentTwinAvatar3D gender={gender} size="lg" animated />
            </div>
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] border border-[#63C63D]/30">
              [ DIGITAL TWIN ]
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              "Let's learn a little first."
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              I need a little more information about how you learn before I can create a personalized adaptive quiz for you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button variant="primary" size="md" onClick={() => navigate('/sessions')} className="w-full sm:w-auto space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>START STUDY SESSION</span>
            </Button>
            <Button variant="outline" size="md" onClick={() => navigate('/topics')} className="w-full sm:w-auto space-x-2">
              <Layers className="w-4 h-4" />
              <span>EXPLORE TOPICS</span>
            </Button>
          </div>
        </div>
      ) : activeQuiz ? (
        /* QUIZ EXECUTION INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {!result ? (
              <Card
                title={`Quiz: ${activeQuiz.topicId?.name || 'Topic'}`}
                subtitle={`Subject: ${activeQuiz.subjectId?.name || 'General'} • Difficulty: ${activeQuiz.difficulty}/5`}
                headerAction={
                  <Button variant="outline" size="sm" onClick={() => setActiveQuiz(null)}>
                    Exit Quiz
                  </Button>
                }
              >
                {/* Progress bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
                    <span>Progress: {Math.round(((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#168F3B] via-[#63C63D] via-[#B7E51D] to-[#FFD900] h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {activeQuiz.questions[currentQuestionIdx] && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl glass-card space-y-2 border-l-4 border-l-[#63C63D]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#168F3B] dark:text-[#B7E51D]">
                        {activeQuiz.questions[currentQuestionIdx].conceptTag || 'Concept Check'}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {currentQuestionIdx + 1}. {activeQuiz.questions[currentQuestionIdx].question}
                      </h3>
                    </div>

                    {/* Answer Options */}
                    <div className="grid grid-cols-1 gap-3">
                      {activeQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                        const isSelected = answers[currentQuestionIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(optIdx)}
                            className={`p-4 rounded-2xl text-left font-bold text-sm transition-all duration-200 border cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#168F3B]/25 via-[#63C63D]/25 to-[#B7E51D]/25 text-slate-900 dark:text-white border-[#63C63D] shadow-lg shadow-[#63C63D]/20 font-black'
                                : 'glass-card hover:border-[#63C63D]/50 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="flex items-center space-x-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                                isSelected ? 'bg-[#63C63D] text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/20 dark:border-slate-800/40">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentQuestionIdx === 0}
                        onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                      >
                        Previous
                      </Button>

                      {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        >
                          Next Question
                        </Button>
                      ) : (
                        <Button
                          variant="important"
                          size="md"
                          loading={submitting}
                          onClick={handleSubmitQuiz}
                          className="space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Submit Quiz</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              /* RESULTS VIEW */
              <Card title="Quiz Attempt Summary" subtitle={`Topic: ${activeQuiz.topicId?.name || 'Topic'}`}>
                <div className="space-y-6 text-center py-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#168F3B] via-[#63C63D] to-[#B7E51D] text-slate-950 flex items-center justify-center mx-auto text-3xl font-black shadow-2xl animate-bounce">
                    {result.score}%
                  </div>

                  <div className="max-w-md mx-auto p-4 rounded-2xl glass-card space-y-1">
                    <p className="text-base font-extrabold text-slate-900 dark:text-white">
                      {result.score >= 80 ? "🎉 Outstanding Retention!" : result.score >= 60 ? "👍 Good effort!" : "💡 Let's revisit this topic once more."}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Correct: <strong className="text-[#36A852]">{result.correctAnswers}</strong> / Total: {result.totalQuestions}.
                      Updated Topic Mastery: <strong className="text-[#63C63D]">{result.updatedMastery?.masteryScore}%</strong>.
                    </p>
                  </div>

                  <div className="text-left space-y-3 pt-4 border-t border-slate-200/20 dark:border-slate-800/40">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Question Review & Explanations:</h4>
                    {result.questionResults?.map((qRes, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                          qRes.isCorrect
                            ? 'bg-[#36A852]/10 border-[#36A852]/40 text-slate-900 dark:text-slate-100'
                            : 'bg-rose-500/10 border-rose-500/40 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{idx + 1}. {qRes.question}</span>
                          {qRes.isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-[#36A852] flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                          )}
                        </div>
                        {qRes.explanation && (
                          <p className="text-[11px] opacity-90 italic">💡 {qRes.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center space-x-3 pt-4">
                    <Button variant="primary" size="md" onClick={() => { setActiveQuiz(null); setResult(null); }}>
                      Back to Quizzes
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card title="Twin Retention Engine">
              <div className="text-center space-y-3">
                <StudentTwinAvatar3D gender={gender} size="lg" animated />
                <div className="p-3 rounded-xl glass-pill text-xs font-semibold text-slate-700 dark:text-slate-300">
                  "Your Twin is checking your retention & calibrating mastery..."
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* QUIZ GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map(q => (
            <Card key={q._id} hover>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] border border-[#63C63D]/30">
                  {q.subjectId?.name || 'Subject'}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Diff: {q.difficulty}/5</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">{q.topicId?.name || 'Topic Quiz'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{q.questions?.length || 0} Questions</p>
              <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => handleStartQuiz(q)}>
                Take Quiz Now
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

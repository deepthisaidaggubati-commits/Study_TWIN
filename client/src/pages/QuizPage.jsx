import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { HelpCircle, CheckCircle, XCircle, Award } from 'lucide-react';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const fetchQuizzes = async () => {
    try {
      const res = await API.get('/quizzes');
      if (res.data.success) setQuizzes(res.data.data);
    } catch (err) {
      toast.error('Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleStartQuiz = (q) => {
    setActiveQuiz(q);
    setAnswers(new Array(q.questions.length).fill(null));
    setResult(null);
  };

  const handleSelectOption = (qIdx, optIdx) => {
    const updated = [...answers];
    updated[qIdx] = optIdx;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.some(a => a === null)) {
      return toast.error('Please answer all questions before submitting.');
    }

    try {
      const res = await API.post(`/quizzes/${activeQuiz._id}/attempt`, {
        answers,
        timeTaken: 30
      });
      if (res.data.success) {
        setResult(res.data.data);
        toast.success(`Quiz Completed! Score: ${res.data.data.score}%`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz attempt.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading quiz system..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Adaptive Quizzes</h1>
          <p className="text-xs text-slate-400">Test retention and calibrate Digital Twin topic mastery</p>
        </div>
      </div>

      {activeQuiz ? (
        <Card title={`Quiz: ${activeQuiz.topicId?.name || 'Topic'}`} subtitle={`Difficulty Level: ${activeQuiz.difficulty}/5`}>
          {!result ? (
            <div className="space-y-6">
              {activeQuiz.questions.map((q, qIdx) => (
                <div key={q._id || qIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-sm font-bold text-white">{qIdx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`p-3 text-left rounded-xl text-xs font-medium border transition-all ${
                          answers[qIdx] === optIdx
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setActiveQuiz(null)}>Exit Quiz</Button>
                <Button variant="primary" size="md" onClick={handleSubmit}>Submit Answers</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl font-black border border-indigo-500/30">
                {result.score}%
              </div>
              <h3 className="text-xl font-bold text-white">Quiz Attempt Summary</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Correct: <span className="text-emerald-400 font-bold">{result.correctAnswers}</span> / Total: {result.totalQuestions}. Your topic mastery score updated to <span className="text-indigo-300 font-bold">{result.updatedMastery?.masteryScore}%</span>.
              </p>
              <Button variant="primary" size="md" onClick={() => { setActiveQuiz(null); setResult(null); }}>Back to Quizzes</Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map(q => (
            <Card key={q._id}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
                  {q.subjectId?.name || 'Subject'}
                </span>
                <span className="text-xs font-semibold text-slate-400">Diff: {q.difficulty}/5</span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">{q.topicId?.name || 'Topic Quiz'}</h3>
              <p className="text-xs text-slate-400 mt-1">{q.questions?.length || 0} Questions</p>
              <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => handleStartQuiz(q)}>
                Take Quiz Now
              </Button>
            </Card>
          ))}

          {quizzes.length === 0 && (
            <div className="col-span-full p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
              No adaptive quizzes created yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

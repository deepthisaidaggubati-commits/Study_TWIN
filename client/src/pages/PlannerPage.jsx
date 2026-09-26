import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Calendar, Sparkles, CheckCircle2, Circle } from 'lucide-react';

export default function PlannerPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState(2);
  const toast = useToast();

  const fetchPlans = async () => {
    try {
      const res = await API.get('/study-plans');
      if (res.data.success) setPlans(res.data.data);
    } catch (err) {
      toast.error('Failed to load study plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleGenerate = async () => {
    try {
      const res = await API.post('/study-plans/generate', { availableHoursPerDay: hours });
      if (res.data.success) {
        toast.success('Adaptive study plan generated!');
        fetchPlans();
      }
    } catch (err) {
      toast.error('Failed to generate study plan.');
    }
  };

  const toggleTask = async (planId, taskId, currentStatus) => {
    try {
      const res = await API.put(`/study-plans/${planId}/tasks`, { taskId, completed: !currentStatus });
      if (res.data.success) {
        toast.success('Task status updated');
        fetchPlans();
      }
    } catch (err) {
      toast.error('Failed to update task.');
    }
  };

  if (loading) return <LoadingSpinner label="Generating adaptive plan..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Adaptive Study Planner</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Dynamic study schedules aligned with your exam dates & weak topics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="glass-input rounded-xl px-3 py-2 text-xs font-semibold"
          >
            <option value="1">1 Hour / Day</option>
            <option value="2">2 Hours / Day</option>
            <option value="4">4 Hours / Day</option>
            <option value="6">6 Hours / Day</option>
          </select>
          <Button variant="primary" size="md" onClick={handleGenerate}>
            <Sparkles className="w-4 h-4 mr-1" />
            <span>Generate Plan</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {plans.map(p => (
          <Card key={p._id} title={`Study Plan — ${new Date(p.date).toLocaleDateString()}`} subtitle={`Est. Duration: ${p.estimatedDuration} minutes`}>
            <div className="space-y-2">
              {p.tasks?.map(t => (
                <div key={t._id} className="flex items-center justify-between p-3.5 glass-card">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => toggleTask(p._id, t._id, t.completed)} className="text-[#63C63D] hover:text-[#B7E51D]">
                      {t.completed ? <CheckCircle2 className="w-5 h-5 text-[#36A852]" /> : <Circle className="w-5 h-5 text-slate-400" />}
                    </button>
                    <div>
                      <h4 className={`text-xs font-bold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {t.topicId?.name || 'Topic Task'}
                      </h4>
                      <span className="text-[10px] text-[#36A852] dark:text-[#B7E51D] font-bold">{t.taskType}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.estimatedDuration} mins</span>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {plans.length === 0 && (
          <div className="p-12 text-center glass-card text-slate-500 dark:text-slate-400 text-sm">
            No active study plans generated. Select your available hours and click "Generate Plan"!
          </div>
        )}
      </div>
    </div>
  );
}

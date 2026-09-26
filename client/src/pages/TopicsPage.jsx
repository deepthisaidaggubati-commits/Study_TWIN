import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { Layers, Plus, Trash2, Award } from 'lucide-react';

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subjectId: '', name: '', description: '', difficulty: 3 });
  const toast = useToast();

  const fetchData = async () => {
    try {
      const [tRes, sRes] = await Promise.all([API.get('/topics'), API.get('/subjects')]);
      if (tRes.data.success) setTopics(tRes.data.data);
      if (sRes.data.success) setSubjects(sRes.data.data);
    } catch (err) {
      toast.error('Failed to load topic data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.name) return toast.error('Subject and Topic name are required.');

    try {
      const res = await API.post('/topics', formData);
      if (res.data.success) {
        toast.success('Topic created!');
        setFormData({ subjectId: '', name: '', description: '', difficulty: 3 });
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating topic.');
    }
  };

  if (loading) return <LoadingSpinner label="Fetching course topics..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Course Topics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Granular learning units tracked by your Digital Twin</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New Topic</span>
        </Button>
      </div>

      {showForm && (
        <Card title="Add New Topic">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select Subject</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-semibold"
                required
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <Input label="Topic Name" placeholder="e.g. 3NF Normalization" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Description" placeholder="Functional Dependency & Candidate Key Analysis" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Difficulty Level (1 - 5)</label>
              <input type="range" min="1" max="5" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) })} className="w-full accent-[#63C63D]" />
              <div className="text-right text-xs font-bold text-[#168F3B] dark:text-[#B7E51D]">Level {formData.difficulty}</div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Save Topic</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map(t => (
          <Card key={t._id} hover className="border-[#63C63D]/30">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] border border-[#63C63D]/30">
                {t.subjectId?.name || 'Subject'}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Diff: {t.difficulty}/5</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">{t.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{t.description || 'No description.'}</p>
          </Card>
        ))}

        {topics.length === 0 && !showForm && (
          <div className="col-span-full p-12 text-center glass-card text-slate-500 dark:text-slate-400 text-sm">
            No topics added yet. Click "Add New Topic" to expand your Digital Twin curriculum!
          </div>
        )}
      </div>
    </div>
  );
}

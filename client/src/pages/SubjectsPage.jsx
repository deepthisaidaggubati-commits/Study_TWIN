import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { BookOpen, Plus, Calendar, Trash2 } from 'lucide-react';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', examDate: '' });
  const toast = useToast();

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects');
      if (res.data.success) setSubjects(res.data.data);
    } catch (err) {
      toast.error('Failed to load subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Subject name is required');

    try {
      const res = await API.post('/subjects', formData);
      if (res.data.success) {
        toast.success('Subject created!');
        setFormData({ name: '', description: '', examDate: '' });
        setShowForm(false);
        fetchSubjects();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating subject');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete subject and all associated topics?')) return;
    try {
      await API.delete(`/subjects/${id}`);
      toast.success('Subject deleted');
      fetchSubjects();
    } catch (err) {
      toast.error('Failed to delete subject');
    }
  };

  if (loading) return <LoadingSpinner label="Fetching your academic subjects..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Academic Subjects</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage courses, curricula, and upcoming exam target dates</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-1" />
          <span>Add New Subject</span>
        </Button>
      </div>

      {showForm && (
        <Card title="Add New Academic Subject">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Subject Name"
              placeholder="e.g. Database Management Systems"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              placeholder="Relational Database Concepts, Normalization, SQL"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              label="Target Exam Date"
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
            />
            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Save Subject</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map(s => (
          <Card key={s._id} hover className="relative group border-[#63C63D]/30">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-[#63C63D]/20 text-[#168F3B] dark:text-[#B7E51D] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <button onClick={() => handleDelete(s._id)} className="text-slate-400 hover:text-rose-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-4">{s.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{s.description || 'No description provided.'}</p>

            {s.examDate && (
              <div className="mt-4 pt-3 border-t border-slate-200/20 dark:border-slate-800/40 flex items-center text-xs text-[#168F3B] dark:text-[#B7E51D] font-bold space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Exam: {new Date(s.examDate).toLocaleDateString()}</span>
              </div>
            )}
          </Card>
        ))}

        {subjects.length === 0 && !showForm && (
          <div className="col-span-full p-12 text-center glass-card text-slate-500 dark:text-slate-400 text-sm">
            No subjects added yet. Click "Add New Subject" to begin!
          </div>
        )}
      </div>
    </div>
  );
}

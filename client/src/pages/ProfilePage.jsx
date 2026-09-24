import React, { useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, BookOpen, GraduationCap, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfileState } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    academicLevel: user?.academicLevel || 'Undergraduate',
    branch: user?.branch || '',
    graduationYear: user?.graduationYear || 2026
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put('/auth/profile', formData);
      if (res.data.success) {
        updateProfileState(res.data.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Student Profile</h1>
        <p className="text-xs text-slate-400">Manage academic identity and Digital Twin settings</p>
      </div>

      <Card title="Personal Academic Details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            icon={User}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Academic Level
            </label>
            <select
              value={formData.academicLevel}
              onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
            >
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Input
            label="Branch / Major"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            icon={BookOpen}
          />

          <Input
            label="Graduation Year"
            type="number"
            value={formData.graduationYear}
            onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
            icon={GraduationCap}
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" loading={loading} className="space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

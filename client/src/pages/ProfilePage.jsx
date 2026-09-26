import React, { useState } from 'react';
import API from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import StudentTwinAvatar3D from '../components/brand/StudentTwinAvatar3D';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, BookOpen, GraduationCap, Save, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfileState } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    academicLevel: user?.academicLevel || 'Undergraduate',
    branch: user?.branch || 'Computer Science',
    graduationYear: user?.graduationYear || 2026,
    gender: user?.gender?.toLowerCase() || 'neutral'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put('/auth/profile', formData);
      if (res.data.success) {
        updateProfileState(res.data.data);
        toast.success('Profile & Twin settings updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Student Profile & Twin Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage academic identity and customize your AI Digital Twin avatar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="md:col-span-2">
          <Card title="Personal & Academic Details">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                icon={User}
              />

              {/* Requirement 6: Gender Personalization */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Digital Twin Companion Persona / Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  <option value="female">Feminine Presenting Twin</option>
                  <option value="male">Masculine Presenting Twin</option>
                  <option value="neutral">Neutral Futuristic Twin</option>
                </select>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Customizes the visual avatar and voice tone of your Digital Twin companion.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Academic Level
                </label>
                <select
                  value={formData.academicLevel}
                  onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm font-semibold"
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

              <div className="pt-3">
                <Button type="submit" variant="primary" size="md" loading={loading} className="space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Live Avatar Preview */}
        <div>
          <Card title="Twin Avatar Preview">
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center">
                <StudentTwinAvatar3D gender={formData.gender} size="hero" animated />
              </div>

              <div className="p-3 rounded-2xl glass-pill text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400 inline mr-1" />
                Live Preview ({formData.gender.toUpperCase()} Persona)
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

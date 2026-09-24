import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Lock, BookOpen, GraduationCap, Calendar, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    academicLevel: 'Undergraduate',
    branch: 'Computer Science',
    graduationYear: 2026
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      toast.success('Twin Profile created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg space-y-6 bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-600/30 mb-2">
            ST
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Study Twin</h2>
          <p className="text-xs text-slate-400">Build your digital learning state representation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Alex Rivera"
            value={formData.name}
            onChange={handleChange}
            required
            icon={User}
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="student@university.edu"
            value={formData.email}
            onChange={handleChange}
            required
            icon={Mail}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            icon={Lock}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Academic Level
              </label>
              <select
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Branch / Course"
              name="branch"
              placeholder="Computer Science"
              value={formData.branch}
              onChange={handleChange}
              icon={BookOpen}
            />
          </div>

          <Input
            label="Graduation Year"
            type="number"
            name="graduationYear"
            placeholder="2026"
            value={formData.graduationYear}
            onChange={handleChange}
            icon={GraduationCap}
          />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full space-x-2 pt-2">
            <UserPlus className="w-4 h-4" />
            <span>Create My Twin Profile</span>
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Already have a Twin?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

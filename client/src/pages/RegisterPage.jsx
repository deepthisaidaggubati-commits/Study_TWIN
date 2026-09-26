import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StudyTwinLogo from '../components/brand/StudyTwinLogo';
import StudentTwinAvatar3D from '../components/brand/StudentTwinAvatar3D';
import AtmosphericBackground from '../components/brand/AtmosphericBackground';
import ThemeToggle from '../components/ui/ThemeToggle';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Lock, BookOpen, GraduationCap, UserPlus } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-[#FFFDF7] text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <AtmosphericBackground />

      {/* Top Header Controls */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle showLabel />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 glass-panel p-8 sm:p-10 rounded-3xl relative z-10 items-center">
        
        {/* Left Side: 3D Twin Teaser */}
        <div className="flex flex-col items-center text-center space-y-4">
          <StudentTwinAvatar3D size="hero" animated />
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-100 dark:text-white light:text-slate-900">Create your Learning Twin</h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed max-w-xs">
              Your personalized digital student journey starts here.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="space-y-5 border-t lg:border-t-0 lg:border-l border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-700/20 pt-6 lg:pt-0 lg:pl-8">
          <div className="space-y-2">
            <StudyTwinLogo variant="full" size="md" animated />
            <h2 className="text-xl font-bold text-slate-100 dark:text-white light:text-slate-900 tracking-tight pt-1">Build Your Profile</h2>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">Enter details to calibrate your twin engine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
                  Academic Level
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-100 dark:text-white light:text-slate-900 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-lime-400/30"
                >
                  <option value="High School" className="bg-slate-900 text-white">High School</option>
                  <option value="Undergraduate" className="bg-slate-900 text-white">Undergraduate</option>
                  <option value="Postgraduate" className="bg-slate-900 text-white">Postgraduate</option>
                  <option value="Other" className="bg-slate-900 text-white">Other</option>
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

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full space-x-2 pt-1">
              <UserPlus className="w-4 h-4" />
              <span>Create My Twin Profile</span>
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-700/20 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
            Already have a Twin?{' '}
            <Link to="/login" className="text-lime-400 dark:text-lime-300 light:text-emerald-800 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

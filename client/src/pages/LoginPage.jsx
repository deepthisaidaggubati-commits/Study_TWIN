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
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast.success(res.message || 'Logged in successfully!');
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

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/90 border border-teal-500/30 dark:border-teal-500/30 light:border-amber-300/80 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10 items-center">
        
        {/* Left Side: 3D Mini Student Twin Greeting */}
        <div className="flex flex-col items-center text-center space-y-4">
          <StudentTwinAvatar3D size="hero" animated />
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-100 dark:text-white light:text-slate-900">Meet your Learning Twin</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed max-w-xs">
              An AI companion that continuously evolves as you learn.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-slate-800 dark:border-slate-800 light:border-amber-200 pt-6 lg:pt-0 lg:pl-8">
          <div className="space-y-2">
            <StudyTwinLogo variant="full" size="md" animated />
            <h2 className="text-xl font-bold text-slate-100 dark:text-white light:text-slate-900 tracking-tight pt-2">Welcome Back</h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">Access your digital learning twin environment</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={Lock}
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full space-x-2">
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 dark:border-slate-800 light:border-amber-200 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
            Don't have a Digital Twin yet?{' '}
            <Link to="/register" className="text-teal-400 dark:text-teal-300 light:text-teal-700 font-bold hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StudyTwinLogo from '../components/brand/StudyTwinLogo';
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-slate-900/80 border border-violet-500/20 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <StudyTwinLogo variant="full" size="xl" animated showTagline />
          <h2 className="text-xl font-bold text-white tracking-tight pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400">Enter your credentials to access your Digital Twin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Don't have a Digital Twin yet?{' '}
          <Link to="/register" className="text-fuchsia-400 font-semibold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

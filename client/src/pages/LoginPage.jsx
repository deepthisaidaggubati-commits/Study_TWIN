import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-600/30 mb-2">
            ST
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back to StudyTwin</h2>
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
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

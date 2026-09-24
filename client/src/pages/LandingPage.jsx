import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Target, Zap, Shield, ArrowRight, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Nav */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
            ST
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            StudyTwin <span className="text-indigo-400 font-extrabold">AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link to="/register">
            <Button variant="primary" size="md">
              Create My Twin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-full text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Next-Generation AI Digital Twin for Personal Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl">
          An AI-Driven Digital Twin for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">Personalized Learning & Performance</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mt-6 font-normal leading-relaxed">
          Stop studying with static timetables. StudyTwin models your exact memory decay, topic mastery, and revision readiness to tell you precisely what to study next.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/register">
            <Button variant="primary" size="lg" className="w-full sm:w-auto space-x-2 shadow-xl shadow-indigo-600/25">
              <span>Create My Twin Now</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Dashboard Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Built for High-Performing Students</h2>
          <p className="text-slate-400 text-sm mt-2">Continuous digital behavior modeling for exponential retention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Digital Twin State Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Continuously updates your mastery, confidence, and accuracy metrics based on study time and quiz performance.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Forgetting-Risk Prediction</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Models memory decay using historical revision frequency and topic difficulty to prevent concept decay before exams.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">What-if Study Simulator</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Simulate hypothetical study schedules (e.g. 2 hrs vs 4 hrs/day) to forecast exam readiness and topic coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        <p>© 2026 StudyTwin AI. Production-Grade Student Intelligence System.</p>
      </footer>
    </div>
  );
}

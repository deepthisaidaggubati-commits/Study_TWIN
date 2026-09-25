import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Target, Zap, Shield, ArrowRight, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import StudyTwinLogo from '../components/brand/StudyTwinLogo';
import StudentTwinAvatar3D from '../components/brand/StudentTwinAvatar3D';
import AtmosphericBackground from '../components/brand/AtmosphericBackground';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-[#FFFDF7] text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden transition-colors duration-300">
      <AtmosphericBackground />

      {/* Header / Nav */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900/80 dark:border-slate-900/80 light:border-amber-200/80 relative z-10">
        <Link to="/" className="focus:outline-none">
          <StudyTwinLogo variant="full" size="md" animated />
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle showLabel />

          <Link to="/login" className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors px-3 py-2">
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
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 text-center flex flex-col items-center relative z-10">
        
        {/* 3D Mini Student Twin Showcase */}
        <div className="mb-6 cursor-pointer transform hover:scale-105 transition-transform duration-300">
          <StudentTwinAvatar3D size="hero" animated />
        </div>

        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500/15 via-purple-500/15 to-amber-500/15 border border-teal-500/30 px-4 py-2 rounded-full text-xs font-bold text-teal-300 dark:text-teal-300 light:text-teal-800 mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>Next-Generation AI Digital Twin for Personal Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 dark:text-white light:text-slate-900 tracking-tight leading-tight max-w-4xl">
          An AI-Driven Digital Twin for <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-fuchsia-400 to-amber-400">Personalized Learning & Performance</span>
        </h1>

        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-lg sm:text-xl max-w-2xl mt-6 font-normal leading-relaxed">
          Stop studying with static timetables. StudyTwin models your exact memory decay, topic mastery, and revision readiness to tell you precisely what to study next.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/register">
            <Button variant="primary" size="lg" className="w-full sm:w-auto space-x-2 shadow-xl shadow-teal-500/25">
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
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-900/80 dark:border-slate-900/80 light:border-amber-200/80 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 dark:text-white light:text-slate-900">Built for High-Performing Students</h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm mt-2">Continuous digital behavior modeling for exponential retention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-white/80 border border-teal-500/20 dark:border-teal-500/20 light:border-amber-200 p-6 rounded-2xl space-y-4 hover:border-teal-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 dark:text-white light:text-slate-900">Digital Twin State Engine</h3>
            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Continuously updates your mastery, confidence, and accuracy metrics based on study time and quiz performance.
            </p>
          </div>

          <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-white/80 border border-fuchsia-500/20 dark:border-fuchsia-500/20 light:border-amber-200 p-6 rounded-2xl space-y-4 hover:border-fuchsia-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 dark:text-white light:text-slate-900">Forgetting-Risk Prediction</h3>
            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Models memory decay using historical revision frequency and topic difficulty to prevent concept decay before exams.
            </p>
          </div>

          <div className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-white/80 border border-amber-500/20 dark:border-amber-500/20 light:border-amber-200 p-6 rounded-2xl space-y-4 hover:border-amber-500/40 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 dark:text-white light:text-slate-900">What-if Study Simulator</h3>
            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Simulate hypothetical study schedules (e.g. 2 hrs vs 4 hrs/day) to forecast exam readiness and topic coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900/80 dark:border-slate-900/80 light:border-amber-200/80 py-8 text-center text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 relative z-10">
        <p>© 2026 StudyTwin AI. Production-Grade Student Intelligence System.</p>
      </footer>
    </div>
  );
}

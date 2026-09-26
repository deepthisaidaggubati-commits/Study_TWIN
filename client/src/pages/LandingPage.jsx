import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Target, Clock, ArrowRight } from 'lucide-react';
import StudyTwinLogo from '../components/brand/StudyTwinLogo';
import StudentTwinAvatar3D from '../components/brand/StudentTwinAvatar3D';
import AtmosphericBackground from '../components/brand/AtmosphericBackground';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      <AtmosphericBackground />

      {/* Header / Nav */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between glass-panel border-b relative z-10">
        <Link to="/" className="focus:outline-none">
          <StudyTwinLogo variant="full" size="md" animated />
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle showLabel />

          <Link to="/login" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#168F3B] dark:hover:text-[#B7E51D] transition-colors px-3 py-2">
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

        <div className="inline-flex items-center space-x-2 glass-pill border border-[#63C63D]/40 px-4 py-2 rounded-full text-xs font-bold text-[#168F3B] dark:text-[#B7E51D] mb-8">
          <Sparkles className="w-4 h-4 text-[#FFD900] animate-pulse" />
          <span>Next-Generation AI Digital Twin for Personal Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl">
          An AI-Driven Digital Twin for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#168F3B] via-[#63C63D] via-[#B7E51D] to-[#FFD900]">Personalized Learning & Performance</span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl max-w-2xl mt-6 font-medium leading-relaxed">
          Stop studying with static timetables. StudyTwin models your exact memory decay, topic mastery, and revision readiness to tell you precisely what to study next.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link to="/register">
            <Button variant="primary" size="lg" className="w-full sm:w-auto space-x-2">
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
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Built for High-Performing Students</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Continuous digital behavior modeling for exponential retention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-[#63C63D] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#63C63D]/20 text-[#36A852] dark:text-[#B7E51D] flex items-center justify-center font-bold">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Digital Twin State Engine</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Continuously updates your mastery, confidence, and accuracy metrics based on study time and quiz performance.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-[#B7E51D] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#B7E51D]/20 text-[#168F3B] dark:text-[#B7E51D] flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Forgetting-Risk Prediction</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Models memory decay using historical revision frequency and topic difficulty to prevent concept decay before exams.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-[#FFD900] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFD900]/20 text-[#FFD900] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">What-if Study Simulator</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Simulate hypothetical study schedules (e.g. 2 hrs vs 4 hrs/day) to forecast exam readiness and topic coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/20 dark:border-slate-800/40 py-8 text-center text-xs text-slate-500 dark:text-slate-400 relative z-10 font-bold">
        <p>© 2026 StudyTwin AI. Production-Grade Student Intelligence System.</p>
      </footer>
    </div>
  );
}

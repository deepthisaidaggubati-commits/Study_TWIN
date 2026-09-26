import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudyTwinLogo from '../components/brand/StudyTwinLogo';
import AtmosphericBackground from '../components/brand/AtmosphericBackground';
import ThemeToggle from '../components/ui/ThemeToggle';
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  Layers,
  Clock,
  HelpCircle,
  BarChart3,
  Calendar,
  Sliders,
  Network,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Zap,
  Lightbulb
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Requirement 20: Sidebar navigation structure
  const navItems = [
    { name: 'My Twin', path: '/my-twin', icon: Brain, isTwin: true },
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Topics', path: '/topics', icon: Layers },
    { name: 'Study Sessions', path: '/sessions', icon: Clock },
    { name: 'Quizzes', path: '/quiz', icon: HelpCircle },
    { name: 'Insights', path: '/recommendations', icon: Lightbulb },
    { name: 'Study Planner', path: '/planner', icon: Calendar },
    { name: 'What-if Simulator', path: '/simulator', icon: Sliders },
    { name: 'Knowledge Graph', path: '/knowledge-graph', icon: Network },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden relative font-sans transition-colors duration-300">
      {/* Moving Atmospheric Background & Particle Network (Requirement 4 & 5) */}
      <AtmosphericBackground />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 glass-panel border-r flex-shrink-0 relative z-20">
        <div className="p-5 border-b border-slate-200/20 dark:border-slate-700/30 flex items-center justify-between">
          <NavLink to="/dashboard" className="focus:outline-none">
            <StudyTwinLogo variant="full" size="md" animated />
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            if (item.isTwin) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-400 via-purple-600 to-pink-500 text-white shadow-teal-500/30 scale-[1.02]'
                      : 'bg-gradient-to-r from-teal-500/15 via-purple-500/15 to-pink-500/15 text-slate-900 dark:text-white border border-teal-500/30 hover:border-teal-400/60'
                  }`}
                >
                  <Icon className="w-5 h-5 text-teal-400 animate-pulse" />
                  <span className="tracking-tight">{item.name}</span>
                  <span className="ml-auto text-[10px] bg-teal-400/25 text-teal-300 dark:text-teal-300 light:text-teal-800 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-teal-400/40">
                    AI
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 via-purple-600 to-pink-600 text-white shadow-md shadow-teal-500/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-200/20 dark:border-slate-700/30">
          <div className="flex items-center space-x-3 p-2.5 rounded-xl glass-pill mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-200/20 dark:border-slate-700/30 flex items-center justify-between">
          <StudyTwinLogo variant="full" size="sm" animated />
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-gradient-to-r from-teal-500 via-purple-600 to-pink-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header */}
        <header className="h-16 glass-panel border-b flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white capitalize hidden sm:block">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button (Digital Sunrise ☀️ vs Digital Night 🌙) */}
            <ThemeToggle showLabel={true} />

            {/* Requirement 21: Topbar Status */}
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-pill border border-teal-500/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-amber-400 bg-clip-text text-transparent font-extrabold">
                ✦ Twin Online
              </span>
              <span className="text-slate-400 text-[11px] font-normal ml-1">"Learning with you"</span>
            </div>

            {/* User Profile */}
            <NavLink to="/profile" className="flex items-center space-x-3 border-l border-slate-200/20 dark:border-slate-700/30 pl-4 group">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-400 transition-colors">{user?.name}</p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{user?.branch || 'Student'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </NavLink>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

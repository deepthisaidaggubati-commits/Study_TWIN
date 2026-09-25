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
  Sparkles
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

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Twin', path: '/my-twin', icon: Brain, highlight: true },
    { name: 'Subjects', path: '/subjects', icon: BookOpen },
    { name: 'Topics', path: '/topics', icon: Layers },
    { name: 'Study Sessions', path: '/sessions', icon: Clock },
    { name: 'Quizzes', path: '/quiz', icon: HelpCircle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Study Planner', path: '/planner', icon: Calendar },
    { name: 'What-if Simulator', path: '/simulator', icon: Sliders },
    { name: 'Knowledge Graph', path: '/knowledge-graph', icon: Network },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-[#FFFDF7] text-slate-100 dark:text-slate-100 light:text-slate-900 flex overflow-hidden relative font-sans transition-colors duration-300">
      {/* Dynamic Moving Atmospheric Background & Particle Network */}
      <AtmosphericBackground />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/80 backdrop-blur-xl border-r border-slate-800/80 dark:border-slate-800/80 light:border-amber-200/80 flex-shrink-0 relative z-20">
        <div className="p-5 border-b border-slate-800/80 dark:border-slate-800/80 light:border-amber-200/80 flex items-center justify-between">
          <NavLink to="/dashboard" className="focus:outline-none">
            <StudyTwinLogo variant="full" size="md" animated />
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 via-purple-600 to-pink-600 text-white shadow-lg shadow-teal-500/25'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-100 dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-amber-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-fuchsia-400 dark:text-fuchsia-400 light:text-teal-600' : 'text-slate-400 dark:text-slate-400 light:text-slate-500'}`} />
                <span>{item.name}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto text-[9px] bg-teal-500/20 text-teal-300 dark:text-teal-300 light:text-teal-800 border border-teal-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Twin
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80 dark:border-slate-800/80 light:border-amber-200/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 dark:bg-slate-800/50 light:bg-amber-50 border border-slate-700/50 dark:border-slate-700/50 light:border-amber-200 mb-3">
            <div className="flex items-center space-x-3 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 via-purple-600 to-pink-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white dark:text-white light:text-slate-900 truncate">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-900 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-amber-200 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-800 dark:border-slate-800 light:border-amber-200 flex items-center justify-between">
          <StudyTwinLogo variant="full" size="sm" animated />
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-gradient-to-r from-teal-500 via-purple-600 to-pink-600 text-white' : 'text-slate-400 dark:text-slate-400 light:text-slate-700 hover:bg-slate-800'
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
        <header className="h-16 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white/70 backdrop-blur-md border-b border-slate-800/80 dark:border-slate-800/80 light:border-amber-200/80 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-100 dark:text-white light:text-slate-900 capitalize hidden sm:block">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sun ☀️ / Moon 🌙 Theme Toggle Button */}
            <ThemeToggle showLabel={true} />

            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-teal-500/10 via-fuchsia-500/10 to-amber-500/10 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-300 dark:text-teal-300 light:text-teal-800">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
              <span className="bg-gradient-to-r from-teal-300 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent dark:from-teal-300 dark:via-fuchsia-200 dark:to-amber-200 light:from-teal-700 light:via-purple-700 light:to-amber-700">Digital Twin Engine Active</span>
            </div>

            <div className="flex items-center space-x-3 border-l border-slate-800 dark:border-slate-800 light:border-amber-200 pl-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-100 dark:text-white light:text-slate-900">{user?.name}</p>
                <p className="text-[10px] text-teal-400 dark:text-teal-400 light:text-teal-700 font-semibold">{user?.branch || 'Student'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
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

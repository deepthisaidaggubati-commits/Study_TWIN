import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Bell
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
            ST
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-wide flex items-center">
              StudyTwin <span className="ml-1 text-xs text-indigo-400 font-extrabold uppercase">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Digital Twin Learning</p>
          </div>
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
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold uppercase">
                    Twin
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-3">
            <div className="flex items-center space-x-3 truncate">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-bold text-indigo-300 text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              ST
            </div>
            <span className="font-bold text-white text-base">StudyTwin AI</span>
          </div>
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
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-white capitalize hidden sm:block">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Digital Twin Engine Active</span>
            </div>

            <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-indigo-400 font-medium">{user?.branch || 'Student'}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyTwinPage from './pages/MyTwinPage';
import SubjectsPage from './pages/SubjectsPage';
import TopicsPage from './pages/TopicsPage';
import SessionsPage from './pages/SessionsPage';
import QuizPage from './pages/QuizPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PlannerPage from './pages/PlannerPage';
import SimulatorPage from './pages/SimulatorPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Guard Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Authenticating Digital Twin..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Only Guard Component (Redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Checking session..." fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* Protected Routes (Dashboard Layout) */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/my-twin" element={<MyTwinPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/topics" element={<TopicsPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/simulator" element={<SimulatorPage />} />
                <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

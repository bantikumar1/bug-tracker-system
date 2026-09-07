import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

import Login from './pages/Login';
import SignupPage from './pages/SignupPage';
import DeveloperRegister from './pages/DeveloperRegister';
import TesterRegister from './pages/TesterRegister';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordOTP from './pages/ResetPasswordOTP';

import Dashboard from './pages/Dashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import TesterDashboard from './pages/TesterDashboard';
import BugList from './pages/BugList';
import CreateBug from './pages/CreateBug';
import BugDetails from './pages/BugDetails';
import TestersPage from './pages/TestersPage';
import DevelopersPage from './pages/DevelopersPage';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import AdminSettings from './pages/AdminSettings';
import DeveloperBugsPage from './pages/DeveloperBugsPage';
import DeveloperSettings from './pages/DeveloperSettings';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Site Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<DeveloperRegister />} />
          <Route path="/tester/register" element={<TesterRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password-otp" element={<ResetPasswordOTP />} />

          {/* Protected Application Routes wrapped in MainLayout */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/developer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <MainLayout>
                  <DeveloperDashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Developer Dedicated Sub-Routes */}
          <Route 
            path="/developer/available-bugs" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <MainLayout>
                  <DeveloperBugsPage filterType="available" />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/developer/my-bugs" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <MainLayout>
                  <DeveloperBugsPage filterType="my-assigned" />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/developer/fixed" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <MainLayout>
                  <DeveloperBugsPage filterType="fixed" />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/developer/settings" 
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <MainLayout>
                  <DeveloperSettings />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tester/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['tester']}>
                <MainLayout>
                  <TesterDashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/bugs" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BugList />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/bugs/create" 
            element={
              <ProtectedRoute allowedRoles={['tester']}>
                <MainLayout>
                  <CreateBug />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/bugs/:id" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BugDetails />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Admin Dedicated Section Routes */}
          <Route 
            path="/admin/testers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <TestersPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/developers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <DevelopersPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminSettings />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminSettings />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Reports />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Legacy Users Route Redirect to /admin/testers */}
          <Route path="/users" element={<Navigate to="/admin/testers" replace />} />

          {/* 404 Undefined Route Handler */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Waitlist from './pages/Waitlist';
import Dashboard from './pages/Dashboard';
import Reward from './pages/Reward';
import RewardHistory from './pages/RewardHistory';
import RecycleHistory from './pages/RecycleHistory';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import RecordWaste from './pages/admin/RecordWaste';
import UserDetail from './pages/admin/UserDetail';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRewards from './pages/admin/ManageRewards';
import Analytics from './pages/admin/Analytics';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Citizen Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['USER', 'CITIZEN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reward"
          element={
            <ProtectedRoute allowedRoles={['USER', 'CITIZEN']}>
              <Reward />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reward-history"
          element={
            <ProtectedRoute allowedRoles={['USER', 'CITIZEN']}>
              <RewardHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycle-history"
          element={
            <ProtectedRoute allowedRoles={['USER', 'CITIZEN']}>
              <RecycleHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['USER', 'CITIZEN']}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['USER', 'CITIZEN', 'ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Staff & Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/record-waste"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COLLECTOR']}>
              <RecordWaste />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users/:userId"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COLLECTOR']}>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-rewards"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageRewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY']}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY']}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
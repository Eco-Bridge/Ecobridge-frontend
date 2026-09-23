import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

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
import Profile from './pages/Profile.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import RecordWaste from './pages/admin/RecordWaste.jsx';
import UserDetail from './pages/admin/UserDetail.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageRewards from './pages/admin/ManageRewards.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import Contact from './pages/Contact.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/reward-history" element={<RewardHistory />} />
        <Route path="/recycle-history" element={<RecycleHistory />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/record-waste" element={<RecordWaste />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-users/:userId" element={<UserDetail />} />
        <Route path="/admin/manage-rewards" element={<ManageRewards />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Routes>
      <VercelAnalytics />
    </AuthProvider>
  );
}

export default App;
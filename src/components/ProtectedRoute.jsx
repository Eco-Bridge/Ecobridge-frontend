import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D631B]/20 border-t-[#0D631B] rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading EcoBridge...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const isStaffRoute = location.pathname.startsWith('/admin');
    return <Navigate to={isStaffRoute ? '/admin-login' : '/login'} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user?.role || 'USER').toUpperCase();
    const hasPermission = allowedRoles.map((r) => r.toUpperCase()).includes(userRole);
    const staffRoles = ['ADMIN', 'COLLECTOR', 'RECYCLING_COMPANY'];

    if (!hasPermission) {
      if (staffRoles.includes(userRole)) {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

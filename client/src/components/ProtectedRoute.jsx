import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectRole, selectUser } from '../features/auth/authSlice';
import { ShieldAlert, Lock, ArrowLeft, Home } from 'lucide-react';
import Button from './Button';

/**
 * ProtectedRoute component - Guards routes based on auth status and role permissions
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectRole);
  const user = useSelector(selectUser);

  // 1. Not authenticated -> Redirect to login with location state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authenticated, but role does not match required roles -> 403 Forbidden
  if (roles.length > 0 && (!userRole || !roles.includes(userRole))) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>HTTP 403: FORBIDDEN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Your account (<span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{user?.email || 'authenticated user'}</span>) with role <span className="font-mono uppercase font-bold text-red-600 dark:text-red-400">{userRole || 'none'}</span> does not have the necessary permissions to access this administrative console.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/">
              <Button variant="outline" className="text-xs">
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Return to Home
              </Button>
            </Link>
            <Link to="/login" state={{ from: location }}>
              <Button variant="primary" className="text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Switch Account / Login as Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized -> Render protected route content
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

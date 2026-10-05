import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import { User, Lock, LogIn, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import usePageTitle from '../hooks/usePageTitle';
import useToast from '../hooks/useToast';

export default function Login() {
  usePageTitle('Sign In');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState('user@audiahybrid.internal');
  const [password, setPassword] = useState('••••••••');

  const redirectTarget = location.state?.from?.pathname || '/';

  const handleMockLogin = (role) => {
    const mockUser =
      role === 'admin'
        ? {
            id: 'usr-admin-01',
            name: 'Dr. ECE Administrator',
            email: 'admin@audiahybrid.internal',
            role: 'admin',
          }
        : {
            id: 'usr-student-02',
            name: 'Alex Rivera (Student)',
            email: 'alex.rivera@audiahybrid.internal',
            role: 'user',
          };

    const mockToken = `mock-jwt-${role}-${Date.now()}`;

    dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    showToast(`Logged in successfully as ${role.toUpperCase()}`, 'success');

    // Navigate back to origin or home
    navigate(redirectTarget, { replace: true });
  };

  const handleStandardSubmit = (e) => {
    e.preventDefault();
    // Default to student user mock login in Phase 2
    handleMockLogin('user');
  };

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <SectionHeader
          eyebrow="AUTHENTICATION PORTAL"
          title="AudiaHybrid Console"
          subtitle="Sign in to access real-time hardware telemetry and administration tools."
          align="center"
          className="mb-4"
        />

        {/* Development Helper Banner (render only in DEV mode) */}
        {import.meta.env.DEV && (
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Phase 2 Dev Quick Login (Mock Auth)</span>
            </div>
            <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
              Dispatch fake JWT credentials to test role-based route guards and protected administration features:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleMockLogin('user')}
                className="w-full text-[11px] bg-white dark:bg-slate-900"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1 text-blue-500" />
                <span>Mock User</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleMockLogin('admin')}
                className="w-full text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Mock Admin</span>
              </Button>
            </div>
          </div>
        )}

        {/* Login Form Card */}
        <Card variant="default" className="p-6 sm:p-8 space-y-4">
          <form className="space-y-4 text-xs sm:text-sm" onSubmit={handleStandardSubmit}>
            
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full" icon={LogIn} iconPosition="right">
                Sign In
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span>Don't have an account? </span>
            <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}

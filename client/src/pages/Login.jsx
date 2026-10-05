import React from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, LogIn, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PillButton from '../components/PillButton';
import LogoBadge from '../components/LogoBadge';

export default function Login() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center flex flex-col items-center">
          <LogoBadge size="sm" className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-darkPrimary">
            Welcome to AudiaHybrid
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-text-darkSecondary mt-1">
            Sign in to access real-time hardware telemetry and admin controls
          </p>
        </div>

        <GlassCard variant="default" rounded="rounded-card" className="p-6 sm:p-8 space-y-5 shadow-xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-text-darkPrimary mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-text-secondary dark:text-text-darkSecondary absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  defaultValue="admin@audiahybrid.internal"
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-text-darkPrimary mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-text-secondary dark:text-text-darkSecondary absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  defaultValue="••••••••"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <PillButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={LogIn}
                iconPosition="right"
              >
                Sign In (Phase 5 Auth)
              </PillButton>
            </div>
          </form>

          <div className="text-center text-xs text-text-secondary dark:text-text-darkSecondary pt-3 border-t border-black/10 dark:border-white/10">
            <span>Don't have an account? </span>
            <Link to="/register" className="font-bold text-primary-dark dark:text-accent hover:underline">
              Create an account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import Card from '../components/Card';
import PillButton from '../components/PillButton';
import LogoBadge from '../components/LogoBadge';

export default function Register() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center flex flex-col items-center">
          <LogoBadge size="sm" className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-headline text-ink dark:text-ink-dark">
            Create Account
          </h1>
          <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark mt-1">
            Register to view live hardware logs and submit audio feedback
          </p>
        </div>

        <Card variant="default" rounded="rounded-card" className="p-6 sm:p-8 space-y-5">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-ink-secondary dark:text-ink-secondaryDark absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Alex Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-xs sm:text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-ink-secondary dark:text-ink-secondaryDark absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-xs sm:text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-ink-secondary dark:text-ink-secondaryDark absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-xs sm:text-sm text-ink dark:text-ink-dark focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            <div className="pt-2">
              <PillButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={UserPlus}
                iconPosition="right"
              >
                Register (Phase 5 Auth)
              </PillButton>
            </div>
          </form>

          <div className="text-center text-xs text-ink-secondary dark:text-ink-secondaryDark pt-3 border-t border-hairline-light dark:border-hairline-dark">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-ink dark:text-ink-dark hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

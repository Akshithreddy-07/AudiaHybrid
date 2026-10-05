import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Radio } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Register() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold mx-auto shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Create User Account
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Join the platform to access hardware logs and submit evaluations
          </p>
        </div>

        <Card variant="default" className="p-6 sm:p-8 space-y-4">
          <form className="space-y-4 text-xs sm:text-sm" onSubmit={(e) => e.preventDefault()}>
            
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Alex Sharma"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
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
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full" icon={UserPlus} iconPosition="right">
                Register Account (Phase 5 Auth)
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import usePageTitle from '../hooks/usePageTitle';
import useToast from '../hooks/useToast';

export default function Register() {
  usePageTitle('Create User Account');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Registration submitted (Full backend registration in Phase 5)', 'info');
    navigate('/login');
  };

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <SectionHeader
          eyebrow="MEMBERSHIP PORTAL"
          title="Create User Account"
          subtitle="Join the platform to access hardware logs and submit evaluations."
          align="center"
          className="mb-4"
        />

        <Card variant="default" className="p-6 sm:p-8 space-y-4">
          <form className="space-y-4 text-xs sm:text-sm" onSubmit={handleSubmit}>
            
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Sharma"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
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
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full" icon={UserPlus} iconPosition="right">
                Register Account
              </Button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}

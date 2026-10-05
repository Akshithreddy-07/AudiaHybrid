import React from 'react';
import { Shield, Users, MessageSquare, Database, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';

export default function Admin() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
            <Shield className="w-3.5 h-3.5" /> Administrative Console
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
            System <span className="font-semibold text-accent">Administration</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary max-w-2xl leading-relaxed">
            Manage user accounts, moderate stakeholder feedback submissions, and inspect PostgreSQL
            telemetry storage logs.
          </p>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-primary-dark dark:text-indigo-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primary dark:text-text-darkPrimary">
            Feedback Moderation
          </h2>
          <p className="text-xs text-text-secondary dark:text-text-darkSecondary leading-relaxed">
            Review incoming stakeholder messages, mark as read, and filter by rating or user role.
          </p>
        </GlassCard>

        <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primary dark:text-text-darkPrimary">
            User Management
          </h2>
          <p className="text-xs text-text-secondary dark:text-text-darkSecondary leading-relaxed">
            Manage authenticated accounts and assign role-based access control (RBAC: user / admin).
          </p>
        </GlassCard>

        <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-status-success">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-text-primary dark:text-text-darkPrimary">
            Readings CRUD
          </h2>
          <p className="text-xs text-text-secondary dark:text-text-darkSecondary leading-relaxed">
            Directly insert, edit, or purge telemetry readings stored in the PostgreSQL database.
          </p>
        </GlassCard>
      </div>

      {/* Phase 5 RBAC Notice */}
      <GlassCard variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <Shield className="w-8 h-8 text-accent mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
          Role-Based Access Control Activating in Phase 5
        </h3>
        <p className="text-sm text-text-secondary dark:text-text-darkSecondary max-w-xl mx-auto">
          In Phase 5, this route will be protected with JWT authentication and requireRole('admin') middleware, rendering live management tables.
        </p>
      </GlassCard>
    </div>
  );
}

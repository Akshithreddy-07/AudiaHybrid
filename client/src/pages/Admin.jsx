import React from 'react';
import { Shield, Users, MessageSquare, Database } from 'lucide-react';
import Card from '../components/Card';

export default function Admin() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
          <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
            Administrative Management
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          System Administration
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
          Manage user accounts, moderate stakeholder feedback submissions, and inspect PostgreSQL database logs.
        </p>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-badge-rf text-white flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold tracking-headline text-ink dark:text-ink-dark">
            Feedback Moderation
          </h2>
          <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
            Review incoming stakeholder messages, mark as read, and filter by clarity rating or role.
          </p>
        </Card>

        <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-badge-optical text-white flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold tracking-headline text-ink dark:text-ink-dark">
            User Management
          </h2>
          <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
            Manage authenticated accounts and assign role-based access control (RBAC: user / admin).
          </p>
        </Card>

        <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-ink text-white dark:bg-white dark:text-ink flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold tracking-headline text-ink dark:text-ink-dark">
            Readings CRUD
          </h2>
          <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
            Directly insert, edit, or purge telemetry readings stored in the PostgreSQL database.
          </p>
        </Card>
      </div>

      {/* Phase 5 Notice */}
      <Card variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <Shield className="w-8 h-8 text-ink dark:text-ink-dark mx-auto" />
        <h3 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
          Role-Based Access Control Activating in Phase 5
        </h3>
        <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-xl mx-auto leading-relaxed">
          In Phase 5, this route will be protected with JWT authentication and requireRole('admin') middleware, rendering live moderation tables.
        </p>
      </Card>
    </div>
  );
}

import React from 'react';
import { Shield, Users, MessageSquare, Database, Terminal } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function Admin() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs font-mono font-bold text-brand-600 uppercase">System Governance</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Administration Console
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Role-Based Access Control (RBAC) panel for feedback moderation, user management, and manual readings insertion.
        </p>
      </div>

      {/* Admin Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="default" className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Feedback Moderation
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Review incoming stakeholder messages, mark as read, delete spam, and filter by rating or stakeholder role.
          </p>
          <div className="pt-2">
            <Badge variant="rf" size="sm">Phase 5 Endpoint</Badge>
          </div>
        </Card>

        <Card variant="default" className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            User Account Management
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Inspect registered accounts, re-assign user/admin roles, and monitor authentication JWT token lifetimes.
          </p>
          <div className="pt-2">
            <Badge variant="hybrid" size="sm">RBAC Protected</Badge>
          </div>
        </Card>

        <Card variant="default" className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Telemetry Database CRUD
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Directly insert calibrated test readings, run manual queries, and manage PostgreSQL table partitioning.
          </p>
          <div className="pt-2">
            <Badge variant="success" size="sm">PostgreSQL Pool</Badge>
          </div>
        </Card>
      </div>

      {/* Phase 5 Notice */}
      <Card variant="default" className="p-8 text-center space-y-3">
        <Shield className="w-8 h-8 text-brand-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Role-Based Route Protection Guard
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          In Phase 5, this view will be secured with JWT authentication and <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-brand-600">requireRole('admin')</code> middleware, rendering live administration tables.
        </p>
      </Card>

    </div>
  );
}

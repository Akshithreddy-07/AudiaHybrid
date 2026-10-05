import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectRole } from '../features/auth/authSlice';
import {
  ShieldCheck,
  Users,
  Database,
  Terminal,
  Activity,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import DataTable from '../components/DataTable';
import usePageTitle from '../hooks/usePageTitle';
import useToast from '../hooks/useToast';

const mockUsers = [
  { id: 'usr-1', name: 'Dr. ECE Administrator', email: 'admin@audiahybrid.internal', role: 'admin', created: '2026-09-12', status: 'Active' },
  { id: 'usr-2', name: 'Alex Rivera (Student)', email: 'alex.rivera@audiahybrid.internal', role: 'user', created: '2026-10-01', status: 'Active' },
  { id: 'usr-3', name: 'Priya Sharma (Faculty)', email: 'priya.sharma@audiahybrid.internal', role: 'user', created: '2026-10-03', status: 'Active' },
  { id: 'usr-4', name: 'Lab Technician', email: 'labtech@audiahybrid.internal', role: 'admin', created: '2026-10-04', status: 'Active' },
];

const mockTelemetryNodes = [
  { id: 'node-tx-01', name: 'AudiaTx-MainHall', linkType: 'RF (AM 1MHz)', status: 'Online', rssi: '-58 dBm', packetRate: '100 Hz' },
  { id: 'node-tx-02', name: 'AudiaTx-OpticLab', linkType: 'Optical IR 940nm', status: 'Online', rssi: '420 Lux', packetRate: '100 Hz' },
  { id: 'node-rx-01', name: 'AudiaRx-MobileUnit', linkType: 'Hybrid Adaptive', status: 'Online', rssi: '-64 dBm / 380 Lux', packetRate: '98 Hz' },
];

export default function Admin() {
  usePageTitle('Admin Console');
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const { showToast } = useToast();

  const [users] = useState(mockUsers);

  const handleActionClick = (actionName) => {
    showToast(`Triggered: ${actionName} (API endpoint wired in Phase 5)`, 'info');
  };

  const userColumns = [
    { key: 'name', label: 'User Name', className: 'font-semibold text-slate-900 dark:text-white' },
    { key: 'email', label: 'Email Address', className: 'font-mono text-slate-600 dark:text-slate-400' },
    {
      key: 'role',
      label: 'Role',
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            val === 'admin'
              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: 'created', label: 'Created At', className: 'font-mono text-slate-500' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {val}
        </span>
      ),
    },
  ];

  const nodeColumns = [
    { key: 'name', label: 'Hardware Node', className: 'font-semibold text-slate-900 dark:text-white' },
    { key: 'linkType', label: 'Physical Link', className: 'font-mono text-slate-600 dark:text-slate-400' },
    {
      key: 'status',
      label: 'Link State',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {val}
        </span>
      ),
    },
    { key: 'rssi', label: 'Signal Strength', className: 'font-mono text-blue-600 dark:text-blue-400' },
    { key: 'packetRate', label: 'Telemetry Stream', className: 'font-mono text-slate-500' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <SectionHeader
        eyebrow="SYSTEM GOVERNANCE & CONTROL"
        title="Administration Console"
        subtitle="Role-Based Access Control (RBAC) panel for managing registered users, telemetry transmitters, and feedback moderation."
        align="left"
      />

      {/* Admin Session Info Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              Authorized Administrator: <span className="font-mono text-blue-600 dark:text-blue-400">{user?.name || 'Admin'}</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Role: <span className="font-mono uppercase font-semibold">{role}</span> • Session Guard: Active
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleActionClick('Sync System Telemetry')}
            className="text-[11px] bg-white dark:bg-slate-900"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>Sync Calibration</span>
          </Button>
        </div>
      </div>

      {/* Admin Operations Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            User Account Management
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Manage authenticated student & instructor accounts, assign RBAC permissions, and revoke JWT sessions.
          </p>
          <div className="pt-2">
            <Badge variant="hybrid" size="sm">4 Registered Users</Badge>
          </div>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Telemetry Calibration
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Configure RF carrier offset frequencies, photodiode Lux thresholds, and envelope detector gain coefficients.
          </p>
          <div className="pt-2">
            <Badge variant="optical" size="sm">3 Hardware Nodes</Badge>
          </div>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            PostgreSQL CRUD Pool
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Directly insert calibrated test telemetry points, monitor timeseries partitions, and download CSV dumps.
          </p>
          <div className="pt-2">
            <Badge variant="audio" size="sm">DB Connection Ready</Badge>
          </div>
        </Card>
      </div>

      {/* User Management Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Registered Platform Users</span>
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleActionClick('Create New User')}
            className="text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>Add User</span>
          </Button>
        </div>
        <DataTable
          columns={userColumns}
          rows={users}
          caption="Registered Users Table"
        />
      </div>

      {/* Hardware Telemetry Nodes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-500" />
            <span>Hardware Telemetry Transmitter Nodes</span>
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleActionClick('Add Telemetry Node')}
            className="text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>Register Node</span>
          </Button>
        </div>
        <DataTable
          columns={nodeColumns}
          rows={mockTelemetryNodes}
          caption="Telemetry Nodes Table"
        />
      </div>

    </div>
  );
}

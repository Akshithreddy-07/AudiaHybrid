import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PillButton from '../components/PillButton';
import LogoBadge from '../components/LogoBadge';

export default function NotFound() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <GlassCard variant="default" rounded="rounded-card" className="max-w-md w-full p-8 text-center space-y-5 shadow-2xl">
        <LogoBadge size="sm" className="mx-auto" />
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold text-primary-dark dark:text-white">404</h1>
        <h2 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
          Signal Channel Not Found
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
          The requested page or telemetry route does not exist or has been relocated in the analog pipeline.
        </p>
        <div className="pt-2">
          <PillButton to="/" variant="primary" size="md" icon={Home}>
            Return to Home Channel
          </PillButton>
        </div>
      </GlassCard>
    </div>
  );
}

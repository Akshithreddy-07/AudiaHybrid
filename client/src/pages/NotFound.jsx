import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import PillButton from '../components/PillButton';
import LogoBadge from '../components/LogoBadge';

export default function NotFound() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <Card variant="default" rounded="rounded-card" className="max-w-md w-full p-8 text-center space-y-5">
        <LogoBadge size="sm" className="mx-auto" />
        <div className="w-12 h-12 rounded-full bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark flex items-center justify-center text-ink dark:text-ink-dark mx-auto">
          <AlertTriangle className="w-6 h-6 text-status-warn" />
        </div>
        <h1 className="text-4xl font-bold tracking-headline text-ink dark:text-ink-dark">404</h1>
        <h2 className="text-lg font-bold tracking-headline text-ink dark:text-ink-dark">
          Signal Channel Not Found
        </h2>
        <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
          The requested page or telemetry route does not exist or has been relocated in the analog pipeline.
        </p>
        <div className="pt-2">
          <PillButton to="/" variant="primary" size="md" icon={Home}>
            Return to Home Channel
          </PillButton>
        </div>
      </Card>
    </div>
  );
}

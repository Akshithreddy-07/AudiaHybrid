import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('404 - Page Not Found');

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <Card variant="default" className="max-w-md w-full p-8 text-center space-y-6 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        
        <div className="space-y-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
            HTTP 404 • ROUTE UNMAPPED
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The requested telemetry endpoint or route has not been mapped in the analog signal pipeline.
          </p>
        </div>

        <div className="pt-2">
          <Button to="/" variant="primary" size="md" icon={Home} iconPosition="left">
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

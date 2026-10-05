import React from 'react';
import { Home, AlertTriangle, Radio } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <Card variant="default" className="max-w-md w-full p-8 text-center space-y-5">
        <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto font-bold">
          <AlertTriangle className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-rose-600 uppercase">Error 404 • Channel Not Found</span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Page Does Not Exist
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The requested telemetry endpoint or route has not been mapped in the analog signal pipeline.
          </p>
        </div>

        <div className="pt-2">
          <Button to="/" variant="primary" size="md" icon={Home} iconPosition="left">
            Return to Home Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

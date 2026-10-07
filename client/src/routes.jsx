import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Telemetry from './pages/Telemetry.jsx';

const Records = lazy(() => import('./pages/Records.jsx'));
const About = lazy(() => import('./pages/About.jsx'));

/**
 * Main application routes with Suspense fallback.
 * @returns {JSX.Element}
 */
export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex flex-col items-center justify-center text-xs font-mono text-[#8A919A] space-y-2">
          <div className="w-4 h-4 border-2 border-[#5DCAA5] border-t-transparent rounded-full animate-spin" />
          <span>Loading instrument module...</span>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/telemetry" element={<Telemetry />} />
        <Route path="/records" element={<Records />} />
        <Route path="/about" element={<About />} />
        {/* Redirect any legacy routes to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;

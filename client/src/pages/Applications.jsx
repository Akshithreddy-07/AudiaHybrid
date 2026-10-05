import React, { useState } from 'react';
import scenariosData from '../data/scenarios.json';
import SectionHeader from '../components/SectionHeader';
import ScenarioSelector from '../components/ScenarioSelector';
import ScenarioCard from '../components/ScenarioCard';
import Card from '../components/Card';
import usePageTitle from '../hooks/usePageTitle';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Applications() {
  usePageTitle('Deployment Scenarios & Applications');
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenariosData[0]?.id || 'classroom');

  const selectedScenario =
    scenariosData.find((s) => s.id === selectedScenarioId) || scenariosData[0];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Page Header */}
      <SectionHeader
        eyebrow="FIELD DEPLOYMENT USE CASES"
        title="Assistive Listening Applications"
        subtitle="Explore how the AudiaHybrid dual-link architecture adapts to diverse physical environments—from obstacle-rich lecture halls to zero-radiation medical suites."
        align="center"
      />

      {/* Scenario Selector Pills */}
      <ScenarioSelector
        scenarios={scenariosData}
        selectedId={selectedScenarioId}
        onSelect={setSelectedScenarioId}
      />

      {/* Active Scenario Card */}
      <ScenarioCard scenario={selectedScenario} />

      {/* Comparative Summary Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {scenariosData.map((s) => (
          <Card
            key={s.id}
            hover
            onClick={() => setSelectedScenarioId(s.id)}
            className={`p-4 cursor-pointer transition-all ${
              s.id === selectedScenarioId
                ? 'ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                : 'opacity-85'
            }`}
          >
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mb-1 uppercase">
              {s.recommendedLink} Optimal
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
              {s.title}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
              {s.summary}
            </p>
          </Card>
        ))}
      </div>

      {/* Bottom CTA to Live Dashboard */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white dark:bg-slate-900 dark:border dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            Want to test channel switching in real-time?
          </h3>
          <p className="text-xs text-slate-400 max-w-lg">
            Open the Live Instrumentation Dashboard to view RF RSSI, Optical Lux sensor levels, and audio waveform telemetry side-by-side.
          </p>
        </div>
        <Link to="/dashboard" className="shrink-0">
          <Button variant="primary" className="text-xs whitespace-nowrap">
            <span>View Live Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

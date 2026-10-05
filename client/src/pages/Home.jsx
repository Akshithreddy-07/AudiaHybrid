import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Radio,
  Sun,
  Sparkles,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import TelemetryMeter from '../components/TelemetryMeter';
import SectionHeader from '../components/SectionHeader';
import usePageTitle from '../hooks/usePageTitle';

// Centralized JSON data imports
import componentsData from '../data/components.json';
import scenariosData from '../data/scenarios.json';

export default function Home() {
  usePageTitle('Home – Dual RF-Optical Assistive Listening Platform');
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenariosData[0]?.id || 'classroom');

  const activeScenario =
    scenariosData.find((s) => s.id === selectedScenarioId) || scenariosData[0];

  return (
    <div className="w-full flex flex-col">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: ENGINEERING HUD & PLATFORM OVERVIEW                      */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 bg-grid-slate py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Mission & Core Spec */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>ECE CAPSTONE PROJECT • COURSE 25SC2008E</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Hybrid RF–Optical <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500">
                  Assistive Listening Platform
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                An analog dual-transmission telemetry and monitoring platform for individuals with hearing impairment. Combines <strong className="text-slate-900 dark:text-white font-semibold">Radio Frequency (RF)</strong> non-line-of-sight penetration with <strong className="text-slate-900 dark:text-white font-semibold">Optical Infrared</strong> noise immunity into an adaptive assistive hearing aid device.
              </p>

              {/* Core Feature Metric Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-lg sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400">&lt; 1 ms</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Analog Latency</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-lg sm:text-xl font-bold font-mono text-amber-500 dark:text-amber-400">0.00% EMI</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Optical Mode</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-lg sm:text-xl font-bold font-mono text-purple-600 dark:text-purple-400">11 Stages</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">Analog Chain</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/architecture">
                  <Button variant="primary" size="lg" className="text-xs sm:text-sm">
                    <span>Inspect 11-Stage Circuit</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/comparison">
                  <Button variant="outline" size="lg" className="text-xs sm:text-sm">
                    <span>RF vs. Optical Spec</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Live Dual-Telemetry Meter HUD */}
            <div className="lg:col-span-5">
              <Card variant="default" className="p-6 space-y-5 bg-white/90 dark:bg-slate-900/90 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Live Telemetry Simulation
                    </span>
                  </div>
                  <Badge variant="hybrid" size="sm">
                    Adaptive Link
                  </Badge>
                </div>

                <div className="space-y-4">
                  <TelemetryMeter
                    label="RF Carrier Signal (RSSI)"
                    value={78.5}
                    unit="%"
                    channel="rf"
                    min={0}
                    max={100}
                    status="Strong (-62 dBm)"
                  />
                  <TelemetryMeter
                    label="Optical Flux (PIN Photodiode)"
                    value={91.2}
                    unit="%"
                    channel="optical"
                    min={0}
                    max={100}
                    status="Optimal (420 Lux)"
                  />
                  <TelemetryMeter
                    label="Audio Output Power (LM386)"
                    value={64.0}
                    unit="%"
                    channel="audio"
                    min={0}
                    max={100}
                    status="SPL 88 dBA"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[11px]">Sampling: 100 Hz</span>
                  <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                    <span>Open Dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 11-STAGE HARDWARE SIGNAL PIPELINE OVERVIEW                             */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="ANALOG SIGNAL PROCESSING"
            title="Complete 11-Stage Hardware Pipeline"
            subtitle="Explore how speech waves propagate through pure analog stages—from acoustic capture to power amplification."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {componentsData.map((stage) => (
              <Link
                key={stage.id}
                to={`/architecture#${stage.id}`}
                className="group p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                      {stage.order}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                      {stage.group === 'transmitter' ? 'Tx' : 'Rx'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {stage.name}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {stage.purpose}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>{stage.keyParts[0]}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/architecture">
              <Button variant="outline" size="md">
                <Cpu className="w-4 h-4 mr-2" />
                <span>Open Full Interactive Circuit Inspector</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ENVIRONMENT LINK RECOMMENDATION PLANNER                                */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FIELD DEPLOYMENT PLANNER"
            title="Adaptive Transmission Recommendations"
            subtitle="Select an operational acoustic environment to view the optimal transmission link justification."
            align="center"
          />

          {/* Scenario Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {scenariosData.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  {scenario.title}
                </button>
              );
            })}
          </div>

          {/* Active Scenario Card */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Selected Environment
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeScenario.title}
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold">
                {activeScenario.recommendedLink === 'RF' && <Radio className="w-4 h-4" />}
                {activeScenario.recommendedLink === 'Optical' && <Sun className="w-4 h-4" />}
                {activeScenario.recommendedLink === 'Hybrid' && <Sparkles className="w-4 h-4" />}
                <span>RECOMMENDED: {activeScenario.recommendedLink.toUpperCase()} LINK</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeScenario.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Why This Link Is Optimal</span>
                </span>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  {activeScenario.why.map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Environmental Cautions</span>
                </span>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  {activeScenario.cautions.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Link to="/applications" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                <span>View All Scenario Diagrams & Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

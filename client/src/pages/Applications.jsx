import React from 'react';
import { GraduationCap, Stethoscope, Landmark, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const scenarios = [
  {
    id: 'classroom',
    name: 'Smart Classroom & Lecture Hall',
    icon: GraduationCap,
    recommended: 'Hybrid Dual-Carrier (RF + Optical)',
    badgeVariant: 'hybrid',
    rfCoverage: '100% Non-Line-of-Sight',
    opticalFidelity: '95% Front-Row Direct',
    description: 'Provides comprehensive omnidirectional RF coverage penetrating rows of desks, students, and room dividers while providing optical listening for students seated directly in front of the podium.',
    bestFitReason: 'Overcomes desk blockage with RF while keeping front-row listeners completely isolated from campus Wi-Fi interference.',
  },
  {
    id: 'hospital',
    name: 'Hospital ICU & MRI Imaging Suites',
    icon: Stethoscope,
    recommended: 'Pure Optical Link (LED–Photodiode)',
    badgeVariant: 'optical',
    rfCoverage: 'Prohibited in MRI Zones',
    opticalFidelity: '99.8% Radiation-Free',
    description: 'Zero RF electromagnetic radiation ensures absolute patient safety and eliminates interference with sensitive EEG, ECG, and MRI neuro-monitoring equipment.',
    bestFitReason: 'Light photons cannot interfere with magnetic resonance coils or medical telemetry transmitters.',
  },
  {
    id: 'museum',
    name: 'Museum & Multi-Exhibit Tour',
    icon: Landmark,
    recommended: 'Localized Optical Exhibit Beacons',
    badgeVariant: 'optical',
    rfCoverage: 'Overarching Tour Docent',
    opticalFidelity: 'Zero Acoustic Bleed',
    description: 'Each exhibit painting or artifact features an overhead intensity-modulated LED. Visitors wearing photodiode receivers hear only the narration for the artifact they are viewing.',
    bestFitReason: 'Light is naturally confined by line-of-sight and room dividers, eliminating bleed between adjacent exhibit spaces.',
  },
  {
    id: 'courtroom',
    name: 'Confidential Courtroom & Meeting Chamber',
    recommended: 'Physically Confined Optical Link',
    badgeVariant: 'optical',
    rfCoverage: 'Vulnerable to Wall Bleed',
    opticalFidelity: '100% Perimeter Contained',
    description: 'Prevents sensitive hearing testimony or board discussions from bleeding through drywall or glass partitions into adjoining corridors.',
    bestFitReason: 'Photons cannot pass through solid walls, guaranteeing physical layer privacy without requiring complex digital encryption.',
  },
];

export default function Applications() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs font-mono font-bold text-brand-600 uppercase">Deployment Architecture</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Real-World Application Scenarios
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Acoustic and electromagnetic deployment profiles demonstrating how AudiaHybrid solves real institutional listening challenges.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          return (
            <Card key={sc.id} variant="default" className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {sc.name}
                    </h2>
                  </div>
                  <Badge variant={sc.badgeVariant} size="sm">
                    {sc.badgeVariant.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sc.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-500">Recommended Mode:</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">{sc.recommended}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-500">RF Coverage Factor:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{sc.rfCoverage}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-500">Optical Fidelity:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{sc.opticalFidelity}</span>
                  </div>
                </div>

              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">ECE Capstone Analysis</span>
                <Button to="/comparison" variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                  Compare Channel Specs
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
}

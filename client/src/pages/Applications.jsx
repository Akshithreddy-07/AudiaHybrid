import React from 'react';
import { Compass, GraduationCap, Stethoscope, Landmark, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';

export default function Applications() {
  const scenarios = [
    {
      id: 'classroom',
      name: 'Smart Classroom & Lecture Hall',
      icon: GraduationCap,
      preferred: 'Hybrid Dual-Link',
      description: 'Provides wide-area non-line-of-sight RF coverage across partitioned seating while offering front-row noise-immune optical listening.',
      badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-200',
    },
    {
      id: 'hospital',
      name: 'Hospital ICU & MRI Imaging Room',
      icon: Stethoscope,
      preferred: 'Optical Link (Pure LOS)',
      description: 'Zero electromagnetic interference ensures total safety around EEG and MRI equipment. Room boundary confinement maintains patient confidentiality.',
      badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200',
    },
    {
      id: 'museum',
      name: 'Museum & Guided Multi-Zone Tour',
      icon: Landmark,
      preferred: 'Hybrid Auto-Selective',
      description: 'Localized LED beacons deliver exhibit-specific audio narration without bleed into adjacent exhibits, while RF handles overarching docent tour broadcasts.',
      badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200',
    },
  ];

  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
            <Compass className="w-3.5 h-3.5" /> Real-World Deployments
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
            Application <span className="font-semibold text-accent">Scenarios</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary max-w-2xl leading-relaxed">
            Discover how AudiaHybrid adapts dynamically to different acoustic and electromagnetic
            environments.
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          return (
            <GlassCard key={sc.id} variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center text-accent shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-pill ${sc.badgeColor}`}>
                  {sc.preferred}
                </span>
              </div>

              <h2 className="text-lg font-bold text-text-primary dark:text-text-darkPrimary">
                {sc.name}
              </h2>

              <p className="text-xs sm:text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
                {sc.description}
              </p>

              <div className="pt-2">
                <PillButton to="/comparison" variant="ghost" size="sm">
                  Compare Channel Specs
                </PillButton>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

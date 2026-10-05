import React from 'react';
import { GraduationCap, Stethoscope, Landmark } from 'lucide-react';
import Card from '../components/Card';
import PillButton from '../components/PillButton';

export default function Applications() {
  const scenarios = [
    {
      id: 'classroom',
      name: 'Smart Classroom & Lecture Hall',
      icon: GraduationCap,
      preferred: 'Hybrid Dual-Link',
      badgeClass: 'bg-badge-rf/10 text-badge-rf border-badge-rf/20',
      description: 'Provides wide-area non-line-of-sight RF coverage across partitioned seating while offering front-row noise-immune optical listening.',
    },
    {
      id: 'hospital',
      name: 'Hospital ICU & MRI Imaging Room',
      icon: Stethoscope,
      preferred: 'Optical Link (Pure LOS)',
      badgeClass: 'bg-badge-optical/10 text-badge-optical border-badge-optical/20',
      description: 'Zero electromagnetic radiation ensures total safety around EEG and MRI equipment. Room boundary confinement maintains patient confidentiality.',
    },
    {
      id: 'museum',
      name: 'Museum & Guided Multi-Zone Tour',
      icon: Landmark,
      preferred: 'Hybrid Auto-Selective',
      badgeClass: 'bg-status-ok/10 text-status-ok border-status-ok/20',
      description: 'Localized LED beacons deliver exhibit-specific audio narration without bleed into adjacent exhibits, while RF handles overarching docent tour broadcasts.',
    },
  ];

  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
          <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
            Real-World Deployments
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          Application Scenarios
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
          How AudiaHybrid adapts dynamically to diverse acoustic and electromagnetic requirements.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          return (
            <Card key={sc.id} variant="default" rounded="rounded-card" hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark flex items-center justify-center text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-pill border ${sc.badgeClass}`}>
                    {sc.preferred}
                  </span>
                </div>

                <h2 className="text-lg font-bold tracking-headline text-ink dark:text-ink-dark">
                  {sc.name}
                </h2>

                <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-hairline-light dark:border-hairline-dark">
                <PillButton to="/comparison" variant="outline" size="sm" className="w-full">
                  Compare Channel Specs
                </PillButton>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { BookOpen, Cpu, Shield, Layers, Users } from 'lucide-react';
import { ABOUT_CONTENT } from '../content/about.js';
import { SignalChainSvg } from '../components/diagrams/SignalChainSvg.jsx';

/**
 * About page displaying engineering specifications, breadboard deviations,
 * telemetry architecture, and academic project metadata.
 * @returns {JSX.Element}
 */
export default function About() {
  const {
    projectTitle,
    course,
    institution,
    abstract,
    designVsPrototype,
    telemetryExplanation,
    technologyComparison,
    team,
    guide,
  } = ABOUT_CONTENT;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-8 text-xs font-mono">
      
      {/* 1. Page Header & Abstract */}
      <section className="border-b border-[#262D31] pb-5 space-y-3">
        <div className="flex items-center gap-2.5 text-[#8A919A] tracking-wider uppercase">
          <BookOpen className="w-4 h-4 text-[#5DCAA5]" />
          <span>Technical Report • {course} • {institution}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E6E3DA]">
          {projectTitle}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-[#8A919A] leading-relaxed max-w-5xl">
          <p className="p-4 bg-[#151A1D] border border-[#262D31] rounded">
            <strong className="text-[#E6E3DA] block mb-1">Acoustic Speech & Multipath Problem:</strong>
            {abstract?.problemStatement}
          </p>
          <p className="p-4 bg-[#151A1D] border border-[#262D31] rounded">
            <strong className="text-[#5DCAA5] block mb-1">Hybrid Analog Signal Processing Architecture:</strong>
            {abstract?.proposedSolution}
          </p>
        </div>
      </section>

      {/* 2. As-Built Signal Chain Diagram */}
      <section aria-label="Signal Chain Topology">
        <SignalChainSvg />
      </section>

      {/* 3. Design vs. Prototype Table */}
      <section className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#378ADD]" />
            <h2 className="font-bold text-[#E6E3DA] uppercase">
              Design vs. Prototype Implementation Trade-offs
            </h2>
          </div>
          <span className="text-[#8A919A]">ECE 25SC2008E Hardware Deviations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262D31] text-[#8A919A]">
                <th className="py-2 px-3">Subsystem Stage</th>
                <th className="py-2 px-3">Original Theoretical Design</th>
                <th className="py-2 px-3 text-[#5DCAA5]">As-Built Breadboard Prototype</th>
                <th className="py-2 px-3">Engineering Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2226] text-[#E6E3DA]">
              {designVsPrototype?.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#1C2226]/50">
                  <td className="py-2.5 px-3 font-semibold text-[#EF9F27] whitespace-nowrap">
                    {item.subsystem}
                  </td>
                  <td className="py-2.5 px-3 text-[#8A919A]">{item.originalDesign}</td>
                  <td className="py-2.5 px-3 text-[#5DCAA5] font-semibold">{item.asBuiltPrototype}</td>
                  <td className="py-2.5 px-3 text-[#8A919A] text-[11px] leading-relaxed">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. How Telemetry Works (Numbered Sequence) */}
      <section className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5DCAA5]" />
            <h2 className="font-bold text-[#E6E3DA] uppercase">
              How the Out-of-Band Telemetry Pipeline Works
            </h2>
          </div>
          <span className="text-[#8A919A]">Decoupled from Audio Path</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {telemetryExplanation?.map((step) => (
            <div key={step.step} className="p-3 bg-[#0F1214] border border-[#262D31] rounded space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#262D31] text-[#5DCAA5] font-bold flex items-center justify-center text-[10px]">
                  {step.step}
                </span>
                <span className="font-bold text-[#E6E3DA]">{step.title}</span>
              </div>
              <p className="text-[11px] text-[#8A919A] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RF vs. Optical Medium General Characteristics */}
      <section className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#EF9F27]" />
            <h2 className="font-bold text-[#E6E3DA] uppercase">
              RF (433 MHz) vs. Optical (940 nm IR) Physical Layer Matrix
            </h2>
          </div>
          <span className="text-[#8A919A]">Theoretical Medium Characteristics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262D31] text-[#8A919A]">
                <th className="py-2 px-3">Physical Layer Parameter</th>
                <th className="py-2 px-3 text-[#EF9F27]">Optical Infrared Link (940 nm IR)</th>
                <th className="py-2 px-3 text-[#378ADD]">Radio Frequency Link (433 MHz RF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2226] text-[#E6E3DA]">
              {technologyComparison?.map((comp, idx) => (
                <tr key={idx} className="hover:bg-[#1C2226]/50">
                  <td className="py-2.5 px-3 font-semibold text-[#E6E3DA]">{comp.parameter}</td>
                  <td className="py-2.5 px-3 text-[#8A919A]">{comp.optical}</td>
                  <td className="py-2.5 px-3 text-[#8A919A]">{comp.rf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Team & Guide Details */}
      {((team && team.length > 0) || guide?.name) && (
        <section className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#262D31] pb-2">
            <Users className="w-4 h-4 text-[#5DCAA5]" />
            <h2 className="font-bold text-[#E6E3DA] uppercase">
              Project Authors & Academic Department
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team?.map((member, idx) => (
              <div key={idx} className="p-3 bg-[#0F1214] border border-[#262D31] rounded space-y-0.5">
                <div className="font-bold text-[#E6E3DA]">{member.name}</div>
                <div className="text-[11px] text-[#5DCAA5]">{member.role}</div>
                {member.rollNumber && <div className="text-[10px] text-[#8A919A]">{member.rollNumber}</div>}
              </div>
            ))}

            {guide?.name && (
              <div className="p-3 bg-[#0F1214] border border-[#262D31] rounded space-y-0.5">
                <div className="font-bold text-[#E6E3DA]">Project Guide: {guide.name}</div>
                <div className="text-[11px] text-[#8A919A]">{guide.designation}</div>
                <div className="text-[10px] text-[#8A919A]">{guide.department}</div>
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}

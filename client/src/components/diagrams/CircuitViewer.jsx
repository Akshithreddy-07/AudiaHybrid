import React, { useState } from 'react';

const STAGE_SCHEMATICS = [
  {
    id: 'preamp',
    title: 'LM741 Audio Pre-Amplifier Stage',
    section: 'Transmitter (Tx)',
    schematicSvg: (
      <svg viewBox="0 0 450 160" className="w-full h-auto text-[#E6E3DA] font-mono text-[10px]" fill="none">
        <rect width="450" height="160" fill="#0F1214" rx="2" />
        {/* Op Amp Symbol */}
        <polygon points="180,40 180,120 250,80" stroke="#378ADD" strokeWidth="2" fill="#151A1D" />
        <text x="188" y="60" fill="#E6E3DA" fontSize="12">-</text>
        <text x="188" y="105" fill="#E6E3DA" fontSize="12">+</text>
        <text x="210" y="83" fill="#378ADD" fontWeight="bold">LM741</text>
        {/* Input line */}
        <line x1="40" y1="60" x2="180" y2="60" stroke="#E6E3DA" strokeWidth="1.5" />
        <rect x="70" y="52" width="30" height="16" stroke="#E6E3DA" strokeWidth="1" fill="#151A1D" />
        <text x="85" y="64" textAnchor="middle" fill="#8A919A" fontSize="8">Rin 1kΩ</text>
        <text x="40" y="45" fill="#8A919A">Mic In (5-20mV)</text>
        {/* Feedback resistor */}
        <polyline points="150,60 150,20 280,20 280,80 250,80" stroke="#E6E3DA" strokeWidth="1.5" />
        <rect x="195" y="12" width="40" height="16" stroke="#E6E3DA" strokeWidth="1" fill="#151A1D" />
        <text x="215" y="24" textAnchor="middle" fill="#8A919A" fontSize="8">Rf 100kΩ Pot</text>
        {/* Non-inverting Ground */}
        <line x1="150" y1="100" x2="180" y2="100" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="150" y1="100" x2="150" y2="130" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="140" y1="130" x2="160" y2="130" stroke="#E6E3DA" strokeWidth="1.5" />
        <text x="150" y="145" textAnchor="middle" fill="#8A919A">GND (Vcc/2)</text>
        {/* Output */}
        <line x1="250" y1="80" x2="400" y2="80" stroke="#E6E3DA" strokeWidth="1.5" />
        <circle cx="330" cy="80" r="3" fill="#5DCAA5" />
        <text x="330" y="70" textAnchor="middle" fill="#5DCAA5" fontWeight="bold">TP1: ~0.8V pk-pk</text>
        <text x="400" y="95" textAnchor="end" fill="#8A919A">To RC Filter &gt;</text>
      </svg>
    ),
    formula: 'Av = -(Rf / Rin) = -(100 kΩ / 1 kΩ) ≈ 100x (40 dB)',
    testVoltages: [
      { point: 'Pin 2 (Inverting Input)', expected: '~0.0 V AC (biased at mid-rail 4.5V DC)' },
      { point: 'Pin 3 (Non-Inverting)', expected: '4.50 V DC (Reference rail)' },
      { point: 'Pin 6 (Op-Amp Output / TP1)', expected: '0.82 V pk-pk AC line level' },
      { point: 'Pin 7 (Vcc Supply)', expected: '+9.0 V DC (Battery supply)' },
    ],
    notes: 'Single +9V supply operation requires a resistor divider (10kΩ/10kΩ) creating a virtual 4.5V mid-rail ground reference to avoid output clipping.',
  },
  {
    id: 'filter',
    title: 'RC Sallen-Key Low-Pass Filter Stage',
    section: 'Transmitter (Tx)',
    schematicSvg: (
      <svg viewBox="0 0 450 160" className="w-full h-auto text-[#E6E3DA] font-mono text-[10px]" fill="none">
        <rect width="450" height="160" fill="#0F1214" rx="2" />
        <line x1="40" y1="80" x2="120" y2="80" stroke="#E6E3DA" strokeWidth="1.5" />
        <rect x="70" y="72" width="30" height="16" stroke="#E6E3DA" strokeWidth="1" fill="#151A1D" />
        <text x="85" y="84" textAnchor="middle" fill="#8A919A" fontSize="8">R1 4.7kΩ</text>
        
        <line x1="120" y1="80" x2="200" y2="80" stroke="#E6E3DA" strokeWidth="1.5" />
        <rect x="150" y="72" width="30" height="16" stroke="#E6E3DA" strokeWidth="1" fill="#151A1D" />
        <text x="165" y="84" textAnchor="middle" fill="#8A919A" fontSize="8">R2 4.7kΩ</text>

        {/* Capacitor to GND */}
        <line x1="200" y1="80" x2="200" y2="120" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="190" y1="120" x2="210" y2="120" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="190" y1="126" x2="210" y2="126" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="200" y1="126" x2="200" y2="145" stroke="#E6E3DA" strokeWidth="1.5" />
        <text x="220" y="125" fill="#8A919A">C1 10nF</text>

        <line x1="200" y1="80" x2="380" y2="80" stroke="#E6E3DA" strokeWidth="1.5" />
        <circle cx="290" cy="80" r="3" fill="#5DCAA5" />
        <text x="290" y="70" textAnchor="middle" fill="#5DCAA5" fontWeight="bold">TP2: Filtered Audio</text>
        <text x="400" y="85" textAnchor="end" fill="#8A919A">To BC547 Driver &gt;</text>
      </svg>
    ),
    formula: 'fc = 1 / (2 * π * R * C) = 1 / (2 * π * 4.7 kΩ * 10 nF) ≈ 3.386 kHz (~3.4 kHz)',
    testVoltages: [
      { point: 'Input @ 1 kHz', expected: '0.80 V pk-pk (0.0 dB attenuation)' },
      { point: 'Cutoff @ 3.4 kHz', expected: '0.56 V pk-pk (-3.0 dB cutoff)' },
      { point: 'Noise @ 10 kHz', expected: '< 0.08 V pk-pk (-20 dB/decade roll-off)' },
    ],
    notes: 'Restricts bandwidth strictly to standard speech frequencies (300 Hz to 3.4 kHz), attenuating electrical hum and high-frequency noise.',
  },
  {
    id: 'tx_driver',
    title: 'BC547 Infrared LED Driver & 433MHz ASK Stage',
    section: 'Transmitter (Tx)',
    schematicSvg: (
      <svg viewBox="0 0 450 160" className="w-full h-auto text-[#E6E3DA] font-mono text-[10px]" fill="none">
        <rect width="450" height="160" fill="#0F1214" rx="2" />
        {/* NPN Transistor */}
        <circle cx="220" cy="80" r="22" stroke="#378ADD" strokeWidth="1.5" fill="#151A1D" />
        <line x1="200" y1="80" x2="212" y2="80" stroke="#E6E3DA" strokeWidth="2" />
        <line x1="212" y1="65" x2="212" y2="95" stroke="#E6E3DA" strokeWidth="2" />
        {/* Collector */}
        <line x1="212" y1="72" x2="228" y2="60" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="228" y1="60" x2="228" y2="20" stroke="#E6E3DA" strokeWidth="1.5" />
        {/* LED in collector path */}
        <polygon points="220,35 236,35 228,48" stroke="#EF9F27" fill="#EF9F27" strokeWidth="1" />
        <text x="245" y="44" fill="#EF9F27" fontWeight="bold">TSAL6100 (940nm)</text>
        {/* Base */}
        <line x1="60" y1="80" x2="200" y2="80" stroke="#E6E3DA" strokeWidth="1.5" />
        <circle cx="120" cy="80" r="3" fill="#5DCAA5" />
        <text x="120" y="70" textAnchor="middle" fill="#5DCAA5">TP3: Base 2.4V DC</text>
        {/* Emitter */}
        <line x1="212" y1="88" x2="228" y2="100" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="228" y1="100" x2="228" y2="140" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="218" y1="140" x2="238" y2="140" stroke="#E6E3DA" strokeWidth="1.5" />
        <text x="228" y="152" textAnchor="middle" fill="#8A919A">GND</text>
        <text x="220" y="95" fill="#378ADD" fontSize="8">BC547</text>
      </svg>
    ),
    formula: 'I_LED = (V_Base - V_be) / R_emitter ≈ (2.4V - 0.7V) / 33 Ω ≈ 51.5 mA modulated current',
    testVoltages: [
      { point: 'BC547 Base (TP3)', expected: '2.0 V to 2.8 V DC (biased with 10k/4.7k divider)' },
      { point: 'BC547 Collector', expected: '4.2 V to 5.8 V modulated' },
      { point: 'IR LED Forward Voltage (Vf)', expected: '1.35 V @ 50 mA forward current' },
    ],
    notes: 'Modulates LED photon flux proportionally with speech voltage amplitude. Zero digital packetization prevents packet dropouts.',
  },
  {
    id: 'rx_stage',
    title: 'Phototransistor & BC547 Receiver Stage',
    section: 'Receiver (Rx)',
    schematicSvg: (
      <svg viewBox="0 0 450 160" className="w-full h-auto text-[#E6E3DA] font-mono text-[10px]" fill="none">
        <rect width="450" height="160" fill="#0F1214" rx="2" />
        {/* Phototransistor */}
        <circle cx="100" cy="80" r="20" stroke="#EF9F27" strokeWidth="1.5" fill="#151A1D" />
        <text x="100" y="83" textAnchor="middle" fill="#EF9F27" fontSize="8">BPW34</text>
        <line x1="100" y1="60" x2="100" y2="20" stroke="#E6E3DA" strokeWidth="1.5" />
        <text x="100" y="15" textAnchor="middle" fill="#8A919A">+5V Vcc</text>
        {/* Coupling to BC547 */}
        <line x1="100" y1="100" x2="100" y2="120" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="100" y1="120" x2="220" y2="120" stroke="#E6E3DA" strokeWidth="1.5" />
        <line x1="220" y1="120" x2="220" y2="80" stroke="#E6E3DA" strokeWidth="1.5" />
        {/* BC547 Gain */}
        <circle cx="250" cy="80" r="20" stroke="#378ADD" strokeWidth="1.5" fill="#151A1D" />
        <text x="250" y="83" textAnchor="middle" fill="#378ADD" fontSize="8">BC547</text>
        <line x1="250" y1="60" x2="250" y2="30" stroke="#E6E3DA" strokeWidth="1.5" />
        <circle cx="310" cy="60" r="3" fill="#5DCAA5" />
        <text x="310" y="50" textAnchor="middle" fill="#5DCAA5">TP4: 2.5–3.5 V DC</text>
        <line x1="250" y1="60" x2="380" y2="60" stroke="#E6E3DA" strokeWidth="1.5" />
        <text x="400" y="65" textAnchor="end" fill="#8A919A">To PAM8403 &gt;</text>
      </svg>
    ),
    formula: 'V_out = I_photo * R_load * h_fe ≈ 25 µA * 10 kΩ * 150 ≈ 375 mV restored audio',
    testVoltages: [
      { point: 'BPW34 Emitter (Rest)', expected: '0.15 V DC (ambient room darkness)' },
      { point: 'BPW34 Emitter (Light Beam)', expected: '1.2 V to 1.8 V DC' },
      { point: 'BC547 Collector (TP4)', expected: '2.5 V to 3.5 V DC (linear active region)' },
    ],
    notes: 'The silicon phototransistor detects intensity changes, and the single BC547 transistor provides high-gain pre-amplification before the PAM8403 power stage.',
  },
];

const DESIGN_VS_PROTOTYPE = [
  {
    subsystem: 'Audio Power Stage',
    theoreticalDesign: 'LM386 Analog Audio Amp (Class-AB, 0.5W, higher heat dissipation)',
    asBuiltPrototype: 'PAM8403 Class-D Stereo/Mono Amp (3.0W, 90% efficiency, runs cool on 5V USB)',
    engineeringRationale: 'PAM8403 provides greater acoustic sound pressure level (SPL) for assistive headsets while drawing minimal battery current.',
  },
  {
    subsystem: 'Optical Sensor',
    theoreticalDesign: 'Discrete BPW34 PIN Photodiode (requires multi-stage Op-Amp TIA)',
    asBuiltPrototype: 'High-Sensitivity NPN Phototransistor + BC547 Gain Stage',
    engineeringRationale: 'Direct optical transconductance gain simplifies board layout, avoids high-frequency PCB parasitic oscillation, and increases optical range.',
  },
  {
    subsystem: 'RF Modulation',
    theoreticalDesign: 'Germanium Diode (1N34A) Envelope Detector with custom LC tank',
    asBuiltPrototype: '433 MHz ASK Receiver Module + BC547 Audio Buffer',
    engineeringRationale: '433 MHz SAW-stabilized receiver eliminates manual inductor tuning drift caused by temperature and student handling.',
  },
];

export default function CircuitViewer() {
  const [selectedStageId, setSelectedStageId] = useState(STAGE_SCHEMATICS[0].id);

  const activeStage =
    STAGE_SCHEMATICS.find((s) => s.id === selectedStageId) || STAGE_SCHEMATICS[0];

  return (
    <div className="space-y-6">
      {/* Schematic Viewer Section */}
      <div className="bg-[#151A1D] border border-[#262D31] rounded-[4px] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#262D31] gap-2">
          <div>
            <span className="text-[10px] font-mono text-[#8A919A] uppercase tracking-wider">
              Schematic & Test Point Inspector
            </span>
            <h3 className="text-sm font-semibold text-[#E6E3DA] font-mono">
              {activeStage.title} ({activeStage.section})
            </h3>
          </div>
          <div className="flex flex-wrap gap-1">
            {STAGE_SCHEMATICS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStageId(s.id)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-[2px] border transition-colors ${
                  s.id === selectedStageId
                    ? 'bg-[#1C2226] text-[#E6E3DA] border-[#E6E3DA]'
                    : 'bg-[#0F1214] text-[#8A919A] border-[#262D31] hover:border-[#5B6068]'
                }`}
              >
                {s.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Schematic Canvas */}
        <div className="border border-[#262D31] rounded-[2px] overflow-hidden">
          {activeStage.schematicSvg}
        </div>

        {/* Formula Box */}
        <div className="p-3 bg-[#1C2226] border border-[#262D31] rounded-[2px] text-xs">
          <span className="text-[10px] font-mono text-[#8A919A] uppercase block mb-0.5">
            Worked Engineering Formula:
          </span>
          <code className="font-mono text-xs text-[#378ADD] font-semibold">
            {activeStage.formula}
          </code>
        </div>

        {/* Test Points Table */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-[#8A919A] uppercase">
            Expected Test Bench Voltages (Multimeter / Oscilloscope):
          </span>
          <div className="overflow-x-auto border border-[#262D31] rounded-[2px]">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-[#1C2226] border-b border-[#262D31] text-[10px] text-[#8A919A]">
                  <th className="py-2 px-3">Test Point</th>
                  <th className="py-2 px-3">Expected Voltage / Amplitude</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262D31]">
                {activeStage.testVoltages.map((tv, idx) => (
                  <tr key={idx} className="hover:bg-[#1C2226]/50">
                    <td className="py-2 px-3 text-[#E6E3DA] font-semibold">{tv.point}</td>
                    <td className="py-2 px-3 text-[#5DCAA5]">{tv.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-[#8A919A] italic border-t border-[#262D31] pt-2">
          Note: {activeStage.notes}
        </p>
      </div>

      {/* Design vs Prototype Comparison Table */}
      <div className="bg-[#151A1D] border border-[#262D31] rounded-[4px] p-5 space-y-3">
        <div>
          <span className="text-[10px] font-mono text-[#8A919A] uppercase tracking-wider">
            Engineering Datasheet Note
          </span>
          <h3 className="text-sm font-semibold text-[#E6E3DA] font-mono">
            Original Theoretical Design vs. As-Built Physical Prototype
          </h3>
          <p className="text-xs text-[#8A919A] max-w-prose mt-1">
            Practical hardware adjustments made during breadboard validation to optimize power consumption, thermal stability, and hearing aid sound clarity.
          </p>
        </div>

        <div className="overflow-x-auto border border-[#262D31] rounded-[2px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1C2226] border-b border-[#262D31] font-mono text-[10px] text-[#8A919A]">
                <th className="py-2.5 px-3 w-1/4">Circuit Subsystem</th>
                <th className="py-2.5 px-3 w-1/3 text-[#EF9F27]">Original Handout Design</th>
                <th className="py-2.5 px-3 w-1/3 text-[#5DCAA5]">As-Built Lab Prototype</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D31] text-xs">
              {DESIGN_VS_PROTOTYPE.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#1C2226]/50 align-top">
                  <td className="py-3 px-3 font-mono font-semibold text-[#E6E3DA]">
                    {row.subsystem}
                  </td>
                  <td className="py-3 px-3 text-[#8A919A]">
                    {row.theoreticalDesign}
                  </td>
                  <td className="py-3 px-3 text-[#E6E3DA]">
                    <div className="font-semibold text-[#5DCAA5] mb-1">{row.asBuiltPrototype}</div>
                    <p className="text-[11px] text-[#8A919A]">{row.engineeringRationale}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

CircuitViewer.propTypes = {
  // Pure UI component
};

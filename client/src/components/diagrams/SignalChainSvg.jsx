import React, { useState } from 'react';

const STAGES = [
  {
    id: 'mic',
    name: 'Electret Capsule',
    category: 'input',
    description: 'Omnidirectional condenser mic with integrated internal JFET impedance converter buffer.',
    operatingPoint: 'Bias: 5V via 4.7kΩ • Output: 5–20 mVpp',
  },
  {
    id: 'preamp',
    name: 'LM741 Pre-Amp',
    category: 'input',
    description: 'Inverting operational amplifier providing 40 dB linear voltage gain for speech envelope capture.',
    operatingPoint: 'Gain: -100 (40 dB) • Vref = 2.5V Virtual GND',
  },
  {
    id: 'filter',
    name: 'RC Low-Pass',
    category: 'filter',
    description: 'Passive RC speech bandpass filter rolling off frequencies above 3.39 kHz to eliminate aliasing.',
    operatingPoint: 'R = 4.7kΩ, C = 10nF • fc = 3.386 kHz (-20 dB/dec)',
  },
  {
    id: 'opt-tx',
    name: 'IR LED Array (940nm)',
    category: 'tx',
    description: 'BC547 driver modulating high-power TSAL6100 940 nm infrared LEDs with direct current modulation.',
    operatingPoint: 'I_peak = 80 mA • Half-angle = ±30°',
  },
  {
    id: 'rf-tx',
    name: '433 MHz ASK Tx',
    category: 'tx',
    description: 'SAW-stabilized 433.92 MHz Amplitude Shift Keying transmitter with quarter-wave whip antenna.',
    operatingPoint: 'P_tx = +10 dBm • Modulation: AM envelope',
  },
  {
    id: 'opt-rx',
    name: 'Phototransistor Rx',
    category: 'rx',
    description: 'Silicon phototransistor with BC547 active pre-gain stage for ambient light noise rejection.',
    operatingPoint: 'V_out = 50–900 mV • Threshold = 200 mV',
  },
  {
    id: 'rf-rx',
    name: '433 MHz ASK Rx',
    category: 'rx',
    description: 'Superheterodyne receiver with envelope demodulation for non-line-of-sight signal recovery.',
    operatingPoint: 'Sensitivity: -105 dBm • Threshold = 150 mV',
  },
  {
    id: 'amp',
    name: 'PAM8403 Power Amp',
    category: 'output',
    description: 'Class-D 3W stereo power amplifier driving 8Ω classroom speaker or 32Ω assistive headphones.',
    operatingPoint: 'Efficiency > 90% • Supply: 5V single-rail',
  },
  {
    id: 'esp32',
    name: 'ESP32 Out-of-Band ADC',
    category: 'telemetry',
    description: 'Samples envelope voltage on GPIO34/35 at 1 Hz for MQTT dashboard telemetry without audio DSP delay.',
    operatingPoint: '12-bit ADC (0–4095 counts) • MQTT 1883',
  },
];

export function SignalChainSvg() {
  const [activeStage, setActiveStage] = useState(STAGES[0]);

  return (
    <div className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
        <span className="font-bold text-[#E6E3DA] uppercase">
          As-Built Analog Hardware Signal Chain Diagram
        </span>
        <span className="text-[#8A919A]">Click or focus any stage to inspect operating parameters</span>
      </div>

      {/* Interactive Flow Grid */}
      <div
        role="group"
        aria-label="Interactive signal processing stages"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2"
      >
        {STAGES.map((stage) => {
          const isSelected = activeStage?.id === stage.id;
          let textColor = 'text-[#8A919A]';
          if (stage.category === 'input') textColor = 'text-[#E6E3DA]';
          else if (stage.category === 'filter') textColor = 'text-[#5DCAA5]';
          else if (stage.category === 'tx' || stage.category === 'rx') {
            textColor = stage.id.includes('opt') ? 'text-[#EF9F27]' : 'text-[#378ADD]';
          } else if (stage.category === 'output') textColor = 'text-[#5DCAA5]';
          else if (stage.category === 'telemetry') textColor = 'text-[#8A919A]';

          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage)}
              onFocus={() => setActiveStage(stage)}
              className={`p-2.5 rounded border text-left transition-all ${
                isSelected
                  ? 'bg-[#0F1214] border-[#5DCAA5] ring-1 ring-[#5DCAA5]'
                  : 'bg-[#0F1214] border-[#262D31] hover:border-[#8A919A]'
              }`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>
                {stage.category}
              </div>
              <div className="text-xs font-bold text-[#E6E3DA] mt-0.5 leading-snug">
                {stage.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Drawer */}
      <div className="p-3.5 bg-[#0F1214] border border-[#262D31] rounded space-y-1.5 animate-fadeIn">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#5DCAA5] uppercase">
            Stage Inspection: {activeStage?.name} ({activeStage?.category?.toUpperCase()})
          </span>
          <span className="text-[11px] text-[#8A919A]">{activeStage?.operatingPoint}</span>
        </div>
        <p className="text-[11px] text-[#8A919A] leading-relaxed">
          {activeStage?.description}
        </p>
      </div>
    </div>
  );
}

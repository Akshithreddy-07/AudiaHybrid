import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CHAIN_STAGES = [
  {
    id: 'mic',
    name: 'Electret Mic',
    spec: 'Capsule + 2.2kΩ bias',
    domain: 'tx',
    desc: 'Converts human speech acoustic vibrations into weak millivolt electrical AC signals (5–20 mV pk-pk).',
  },
  {
    id: 'preamp',
    name: 'LM741 Pre-Amp',
    spec: 'Av ≈ 20–40 dB',
    domain: 'tx',
    desc: 'Inverting operational amplifier configuration boosting raw mic signals to line-level (~0.5–1.0 V).',
  },
  {
    id: 'filter',
    name: 'RC Low-Pass',
    spec: 'fc ≈ 3.39 kHz (4.7kΩ + 10nF)',
    domain: 'tx',
    desc: 'Band-limits voice spectrum to 300 Hz–3.4 kHz speech intelligibility standard; rejects high-frequency noise.',
  },
  {
    id: 'driver',
    name: 'BC547 LED / ASK Tx',
    spec: '940nm IR + 433MHz RF',
    domain: 'tx',
    desc: 'Drives TSAL6100 940nm infrared LED array and modulates 433 MHz RF ASK oscillator stage.',
  },
  {
    id: 'medium',
    name: 'Free-Space Link',
    spec: 'Photons + EM Waves',
    domain: 'medium',
    desc: 'Light beam propagation (Line-of-Sight, 0% EMI) and RF electromagnetic radiation (Non-Line-of-Sight).',
  },
  {
    id: 'rx',
    name: 'Phototransistor / RF Rx',
    spec: 'BPW34 / 433MHz ASK Rx',
    domain: 'rx',
    desc: 'Detects infrared photons and captures 433 MHz RF wave; produces proportional microamp currents.',
  },
  {
    id: 'gain',
    name: 'BC547 Audio Gain',
    spec: 'Vce ≈ 2.5–3.5 V',
    domain: 'rx',
    desc: 'Common-emitter analog transistor amplifier stage restoring demodulated audio voltage to ~300–500 mV.',
  },
  {
    id: 'amp',
    name: 'PAM8403 Power Amp',
    spec: '3W Class-D Stereo/Mono',
    domain: 'rx',
    desc: 'High-efficiency power amplifier stage driving low-impedance 8Ω speaker or assistive headphone transducers.',
  },
];

export default function SignalChainDiagram({ onSelectStage }) {
  const [activeStage, setActiveStage] = useState(CHAIN_STAGES[0]);

  const handleSelect = (stage) => {
    setActiveStage(stage);
    if (onSelectStage) onSelectStage(stage);
  };

  return (
    <div className="w-full bg-[#151A1D] border border-[#262D31] rounded-[4px] p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#262D31] gap-2">
        <div>
          <span className="text-[10px] font-mono text-[#8A919A] tracking-wider uppercase">
            End-to-End Hardware Signal Pipeline
          </span>
          <h2 className="text-sm font-semibold text-[#E6E3DA] font-mono">
            Pure Analog Signal Chain (Zero Digital Audio DSP)
          </h2>
        </div>
        <div className="text-[11px] font-mono text-[#5DCAA5]">
          LATENCY: &lt; 1 ms (ANALOG PROPAGATION)
        </div>
      </div>

      {/* Interactive Horizontal Pipeline Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {CHAIN_STAGES.map((stage, idx) => {
          const isSelected = activeStage.id === stage.id;
          const isTx = stage.domain === 'tx';
          const isRx = stage.domain === 'rx';

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => handleSelect(stage)}
              onFocus={() => handleSelect(stage)}
              className={`p-2.5 rounded-[2px] border text-left flex flex-col justify-between min-h-[90px] transition-colors focus:outline-none focus:ring-1 focus:ring-[#E6E3DA] ${
                isSelected
                  ? 'bg-[#1C2226] border-[#E6E3DA]'
                  : 'bg-[#0F1214] border-[#262D31] hover:border-[#5B6068]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[9px] font-mono text-[#8A919A] mb-1">
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  <span
                    className={
                      isTx
                        ? 'text-[#378ADD]'
                        : isRx
                        ? 'text-[#EF9F27]'
                        : 'text-[#5DCAA5]'
                    }
                  >
                    {stage.domain.toUpperCase()}
                  </span>
                </div>
                <div className="font-mono text-xs font-semibold text-[#E6E3DA] line-clamp-2 leading-tight">
                  {stage.name}
                </div>
              </div>

              <div className="text-[9px] font-mono text-[#8A919A] truncate mt-2 border-t border-[#262D31] pt-1">
                {stage.spec}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Description Detail Panel */}
      <div className="p-3 rounded-[2px] bg-[#1C2226] border border-[#262D31] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-mono font-semibold text-[#E6E3DA] mr-2">
            [{activeStage.name}]:
          </span>
          <span className="text-[#8A919A] leading-relaxed">
            {activeStage.desc}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#378ADD] shrink-0">
          PART: {activeStage.spec}
        </span>
      </div>
    </div>
  );
}

SignalChainDiagram.propTypes = {
  onSelectStage: PropTypes.func,
};

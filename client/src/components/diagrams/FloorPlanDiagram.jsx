import React from 'react';
import PropTypes from 'prop-types';

export default function FloorPlanDiagram({ scenarioId }) {
  if (scenarioId === 'classroom') {
    return (
      <svg viewBox="0 0 500 240" className="w-full h-auto bg-[#0F1214] border border-[#262D31] rounded-[2px]" fill="none">
        {/* Room boundary */}
        <rect x="20" y="20" width="460" height="200" stroke="#262D31" strokeWidth="2" />
        <text x="35" y="42" fill="#8A919A" fontFamily="monospace" fontSize="10">AUDITORIUM LECTURE HALL (30m x 15m)</text>
        
        {/* Lecturer Podium / RF Tx */}
        <rect x="50" y="80" width="40" height="80" stroke="#378ADD" strokeWidth="1.5" fill="#151A1D" />
        <text x="70" y="115" textAnchor="middle" fill="#378ADD" fontFamily="monospace" fontSize="9" fontWeight="bold">LECTURER</text>
        <text x="70" y="130" textAnchor="middle" fill="#8A919A" fontFamily="monospace" fontSize="8">RF Tx</text>

        {/* Omnidirectional RF Waves */}
        <path d="M 100 80 A 60 60 0 0 1 100 160" stroke="#378ADD" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M 130 60 A 100 100 0 0 1 130 180" stroke="#378ADD" strokeWidth="1.5" />
        <path d="M 170 40 A 150 150 0 0 1 170 200" stroke="#378ADD" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Student Desk rows */}
        <rect x="220" y="50" width="15" height="140" fill="#1C2226" stroke="#262D31" />
        <rect x="280" y="50" width="15" height="140" fill="#1C2226" stroke="#262D31" />
        <rect x="340" y="50" width="15" height="140" fill="#1C2226" stroke="#262D31" />

        {/* Student Receivers */}
        <rect x="380" y="70" width="30" height="30" stroke="#5DCAA5" strokeWidth="1" fill="#151A1D" />
        <text x="395" y="88" textAnchor="middle" fill="#5DCAA5" fontFamily="monospace" fontSize="8">Rx 1</text>

        <rect x="380" y="140" width="30" height="30" stroke="#5DCAA5" strokeWidth="1" fill="#151A1D" />
        <text x="395" y="158" textAnchor="middle" fill="#5DCAA5" fontFamily="monospace" fontSize="8">Rx 2</text>

        <text x="350" y="210" fill="#8A919A" fontFamily="monospace" fontSize="8">Non-Line-of-Sight RF Penetrates Desks & Obstacles</text>
      </svg>
    );
  }

  if (scenarioId === 'hospital') {
    return (
      <svg viewBox="0 0 500 240" className="w-full h-auto bg-[#0F1214] border border-[#262D31] rounded-[2px]" fill="none">
        <rect x="20" y="20" width="460" height="200" stroke="#262D31" strokeWidth="2" />
        <text x="35" y="42" fill="#8A919A" fontFamily="monospace" fontSize="10">MRI DIAGNOSTIC SUITE & SHIELDED ENCLOSURE</text>

        {/* RF Prohibited Zone */}
        <rect x="240" y="45" width="220" height="150" stroke="#E5484D" strokeWidth="1.5" strokeDasharray="3 3" fill="#151A1D" />
        <text x="350" y="65" textAnchor="middle" fill="#E5484D" fontFamily="monospace" fontSize="9" fontWeight="bold">0% RF EMISSIONS ALLOWED</text>
        <text x="350" y="80" textAnchor="middle" fill="#8A919A" fontFamily="monospace" fontSize="8">Sensitive Superconducting Magnet</text>

        {/* Doctor Console Tx */}
        <rect x="50" y="100" width="50" height="60" stroke="#EF9F27" strokeWidth="1.5" fill="#151A1D" />
        <text x="75" y="130" textAnchor="middle" fill="#EF9F27" fontFamily="monospace" fontSize="9" fontWeight="bold">DOCTOR</text>
        <text x="75" y="145" textAnchor="middle" fill="#8A919A" fontFamily="monospace" fontSize="8">LED Tx</text>

        {/* Collimated Light Beam (LOS) */}
        <polygon points="100,130 330,110 330,150 100,130" fill="#EF9F27" fillOpacity="0.12" stroke="#EF9F27" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="100" y1="130" x2="330" y2="130" stroke="#EF9F27" strokeWidth="1.5" />

        {/* Patient Optical Rx */}
        <rect x="330" y="110" width="45" height="40" stroke="#EF9F27" strokeWidth="1.5" fill="#151A1D" />
        <text x="352" y="132" textAnchor="middle" fill="#EF9F27" fontFamily="monospace" fontSize="8" fontWeight="bold">PATIENT</text>
        <text x="352" y="144" textAnchor="middle" fill="#8A919A" fontFamily="monospace" fontSize="7">BPW34 Rx</text>

        <text x="120" y="210" fill="#EF9F27" fontFamily="monospace" fontSize="8">100% Noise Immune Optical Beam (Zero EMI Radiation)</text>
      </svg>
    );
  }

  // Museum / Guided Tour Floor Plan
  return (
    <svg viewBox="0 0 500 240" className="w-full h-auto bg-[#0F1214] border border-[#262D31] rounded-[2px]" fill="none">
      <rect x="20" y="20" width="460" height="200" stroke="#262D31" strokeWidth="2" />
      <text x="35" y="42" fill="#8A919A" fontFamily="monospace" fontSize="10">MUSEUM EXHIBITION GALLERY (DUAL-LINK ADAPTIVE)</text>

      {/* Main Hall RF Zone */}
      <rect x="40" y="60" width="180" height="140" stroke="#378ADD" strokeWidth="1" strokeDasharray="3 3" />
      <text x="130" y="80" textAnchor="middle" fill="#378ADD" fontFamily="monospace" fontSize="9" fontWeight="bold">OPEN ATRIUM (RF COVERAGE)</text>
      <circle cx="130" cy="130" r="15" stroke="#378ADD" fill="#151A1D" />
      <text x="130" y="134" textAnchor="middle" fill="#378ADD" fontFamily="monospace" fontSize="8">Tx</text>

      {/* Exhibit Display Showcases (Optical Spotlight Zone) */}
      <rect x="260" y="60" width="90" height="60" stroke="#EF9F27" strokeWidth="1.5" fill="#151A1D" />
      <text x="305" y="85" textAnchor="middle" fill="#EF9F27" fontFamily="monospace" fontSize="8" fontWeight="bold">EXHIBIT A</text>
      <text x="305" y="100" textAnchor="middle" fill="#8A919A" fontFamily="monospace" fontSize="7">Optical Spotlight</text>

      <rect x="375" y="60" width="90" height="60" stroke="#EF9F27" strokeWidth="1.5" fill="#151A1D" />
      <text x="420" y="85" textAnchor="middle" fill="#EF9F27" fontFamily="monospace" fontSize="8" fontWeight="bold">EXHIBIT B</text>
      <text x="420" y="100" textAnchor="middle" fill="#8A919A" fontFamily="monospace" fontSize="7">Optical Spotlight</text>

      {/* Visitor with Hybrid Headset */}
      <rect x="310" y="150" width="120" height="40" stroke="#5DCAA5" strokeWidth="1" fill="#151A1D" />
      <text x="370" y="172" textAnchor="middle" fill="#5DCAA5" fontFamily="monospace" fontSize="8" fontWeight="bold">VISITOR HEADSET</text>
      <text x="370" y="184" textAnchor="middle" fill="#8A919A" fontFamily="monospace" fontSize="7">Auto Hysteresis Switching</text>
    </svg>
  );
}

FloorPlanDiagram.propTypes = {
  scenarioId: PropTypes.string.isRequired,
};

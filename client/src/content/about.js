/**
 * @typedef {Object} TeamMember
 * @property {string} name
 * @property {string} role
 * @property {string} [rollNumber]
 * @property {string} [email]
 */

/**
 * @typedef {Object} AboutContent
 * @property {string} projectTitle
 * @property {string} course
 * @property {string} institution
 * @property {string} academicYear
 * @property {{ problemStatement: string, proposedSolution: string }} abstract
 * @property {Array<{ subsystem: string, originalDesign: string, asBuiltPrototype: string, reason: string }>} designVsPrototype
 * @property {Array<{ step: number, title: string, description: string }>} telemetryExplanation
 * @property {Array<{ parameter: string, optical: string, rf: string }>} technologyComparison
 * @property {TeamMember[]} team
 * @property {{ name: string, designation: string, department: string }} guide
 */

/** @type {AboutContent} */
export const ABOUT_CONTENT = {
  projectTitle: 'AudiaHybrid: Hybrid RF–Optical Assistive Listening System',
  course: 'Full Stack Web Development (25SC2008E)',
  institution: 'KL University',
  academicYear: '2026',
  abstract: {
    problemStatement:
      'In high-noise acoustic environments such as lecture halls, medical examination suites, and industrial training floors, conventional hearing aids and assistive FM listening devices struggle with electromagnetic interference, acoustic multipath reverberation, and signal bleed across adjoining rooms. Standard single-medium solutions fail when either physical line-of-sight is obstructed (optical) or heavy EM noise from electrical machinery overwhelms the carrier (RF).',
    proposedSolution:
      'AudiaHybrid implements an analog dual-medium assistive listening architecture combining a 433 MHz RF channel with a 940 nm infrared optical link. The primary audio signal path remains entirely analog from the electret microphone through Sallen-Key filtering (~3.4 kHz) to the PAM8403 headphone amplifier, ensuring no digital processing latency in the listening loop. An out-of-band ESP32 telemetry bridge samples envelope voltages and streams metrics over MQTT to this dashboard for live link diagnostics and hysteresis-based receiver recommendation.',
  },
  designVsPrototype: [
    {
      subsystem: 'Audio Pre-Amplifier',
      originalDesign: 'LM741 Inverting Op-Amp with dual-rail ±12V power supply',
      asBuiltPrototype: 'LM741 Single-Supply 5V Virtual Ground Configuration',
      reason: 'Simplified portable battery operation on a single 5V breadboard bus rail without requiring bulky bipolar DC converters.',
    },
    {
      subsystem: 'Audio Power Output',
      originalDesign: 'LM386 Discrete 1W Class-AB Power Amplifier',
      asBuiltPrototype: 'PAM8403 Class-D 3W Stereo Audio Amplifier Module',
      reason: 'Significantly higher electrical efficiency (>90%), minimal thermal dissipation, and direct compatibility with 5V single-rail supply.',
    },
    {
      subsystem: 'Optical Detector Stage',
      originalDesign: 'BPW34 Silicon PIN Photodiode + High-Gain Transimpedance Op-Amp',
      asBuiltPrototype: 'Silicon Phototransistor with BC547 Active Transistor Pre-Gain Stage',
      reason: 'Higher intrinsic current gain (beta ~ 200) improves breadboard noise immunity against stray ambient 50 Hz/100 Hz room light flicker.',
    },
    {
      subsystem: 'RF Modulation & Transmission',
      originalDesign: 'Discrete Colpitts LC Oscillator + Collector AM Modulator',
      asBuiltPrototype: '433.92 MHz SAW-Stabilized ASK Transmitter & Superheterodyne Receiver Module',
      reason: 'Guaranteed carrier frequency stability without manual ferrite coil tuning drift caused by temperature or hand capacitance.',
    },
  ],
  telemetryExplanation: [
    {
      step: 1,
      title: 'Out-of-Band ADC Sampling',
      description:
        'The ESP32 microcontroller measures peak-to-peak and RMS signal envelopes on ADC pins GPIO34 (Optical) and GPIO35 (RF) at 1 reading per second. The audio path itself is never digitized.',
    },
    {
      step: 2,
      title: 'Lightweight MQTT Publishing',
      description:
        'Telemetry packets containing 12-bit ADC counts (0–4095) and Wi-Fi RSSI (dBm) are published to topic "audiahv/rx/telemetry" over standard MQTT TCP port 1883.',
    },
    {
      step: 3,
      title: 'Backend Aggregation & WebSocket Bridge',
      description:
        'A Node.js / Express service subscribes to the broker, inserts time-bucketed points into PostgreSQL, and broadcasts live events over Socket.io namespace /live and SSE /api/stream.',
    },
    {
      step: 4,
      title: 'Dashboard Hysteresis Analysis',
      description:
        'This client dashboard receives readings in real time, applies client-side smoothing, renders 60-second rolling ring buffers, and computes link recommendations without server round-trip latency.',
    },
  ],
  technologyComparison: [
    {
      parameter: 'Line-of-Sight Requirement',
      optical: 'Strict Line-of-Sight required; obstructed by opaque objects and room dividers',
      rf: 'Non-Line-of-Sight; easily penetrates drywall, wooden partitions, and clothing',
    },
    {
      parameter: 'Indoor Range',
      optical: 'Short to medium range (up to 8 meters with high-power 940 nm IR LEDs)',
      rf: 'Medium to long range (up to 30+ meters across entire lecture halls)',
    },
    {
      parameter: 'Electromagnetic Immunity',
      optical: '100% immune to RF noise, motor brushes, switched-mode PSUs, and Wi-Fi',
      rf: 'Susceptible to electrical noise, heavy machinery sparks, and RF harmonics',
    },
    {
      parameter: 'Eavesdropping & Security',
      optical: 'Room-bounded; photons cannot penetrate walls, ideal for clinical/HIPAA privacy',
      rf: 'Signals propagate through walls into hallways and adjacent classrooms',
    },
    {
      parameter: 'Primary Deployment Zone',
      optical: 'Hospital ICU/MRI suites, confidential lecture halls, and museum exhibit booths',
      rf: 'Large auditorium seating, multi-room campus spaces, and obstacle-rich workshops',
    },
  ],
  team: [
    {
      name: 'Cyril',
      role: 'Hardware Design, Analog Signal Processing & Full Stack Development',
      rollNumber: '25SC2008E Student',
    },
  ],
  guide: {
    name: 'Faculty Course Coordinator',
    designation: 'Department of Electronics and Communication Engineering',
    department: 'KL University',
  },
};

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Mic, MicOff, AlertCircle } from 'lucide-react';
import { useAudioInput } from '../../hooks/useAudioInput.js';

export function LiveAudioPanel() {
  const {
    isCapturing,
    devices = [],
    selectedDeviceId,
    setSelectedDeviceId,
    startCapture,
    stopCapture,
    error,
    analyserNode,
    audioLevel = 0,
    isClipping = false,
  } = useAudioInput();

  const [viewMode, setViewMode] = useState('waveform');
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Real-time canvas render loop for Waveform & Spectrum
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#0F1214';
      ctx.fillRect(0, 0, width, height);

      // Grid rules
      ctx.strokeStyle = '#262D31';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (!isCapturing || !analyserNode) {
        // Idle flat line
        ctx.strokeStyle = '#378ADD';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.fillStyle = '#8A919A';
        ctx.font = '11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AUDIO CAPTURE STANDBY • CLICK START TO MONITOR RECEIVER', width / 2, height / 2 - 12);
        return;
      }

      if (viewMode === 'waveform') {
        // Time-Domain Oscilloscope
        const bufferLength = analyserNode.fftSize;
        const timeData = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(timeData);

        ctx.strokeStyle = isClipping ? '#E5484D' : '#5DCAA5';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        // Frequency Domain FFT Spectrum
        const bufferLength = analyserNode.frequencyBinCount;
        const freqData = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(freqData);

        const barWidth = (width / (bufferLength / 2)) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength / 2; i++) {
          const barHeight = (freqData[i] / 255) * height;

          // Bandpass speech emphasis color
          if (i > 8 && i < 75) {
            ctx.fillStyle = '#EF9F27'; // Voice passband ~300Hz-3.4kHz
          } else {
            ctx.fillStyle = '#378ADD';
          }

          ctx.fillRect(x, height - barHeight, Math.max(1, barWidth - 1), barHeight);
          x += barWidth;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCapturing, analyserNode, viewMode, isClipping]);

  return (
    <section aria-labelledby="audio-panel-title" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-4">
      {/* Panel Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262D31] pb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#5DCAA5]" />
          <h2 id="audio-panel-title" className="text-xs font-mono font-bold text-[#E6E3DA] uppercase tracking-wider">
            Receiver Audio Output Monitor (Web Audio Loopback)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Waveform / Spectrum Toggle */}
          <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5" role="group" aria-label="Audio visualizer mode">
            <button
              onClick={() => setViewMode('waveform')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                viewMode === 'waveform'
                  ? 'bg-[#262D31] text-[#5DCAA5]'
                  : 'text-[#8A919A] hover:text-[#E6E3DA]'
              }`}
            >
              Waveform
            </button>
            <button
              onClick={() => setViewMode('spectrum')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                viewMode === 'spectrum'
                  ? 'bg-[#262D31] text-[#EF9F27]'
                  : 'text-[#8A919A] hover:text-[#E6E3DA]'
              }`}
            >
              Spectrum (FFT)
            </button>
          </div>

          {/* Device Selector */}
          {devices.length > 0 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="px-2 py-1 text-[11px] font-mono bg-[#0F1214] border border-[#262D31] rounded text-[#E6E3DA] focus:outline-none"
              aria-label="Select audio input hardware"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label}
                </option>
              ))}
            </select>
          )}

          {/* Start / Stop Capture Button */}
          <button
            onClick={isCapturing ? stopCapture : startCapture}
            className={`px-3 py-1 text-xs font-mono font-bold rounded border transition-colors flex items-center gap-1.5 ${
              isCapturing
                ? 'bg-[#E5484D]/15 border-[#E5484D] text-[#E5484D]'
                : 'bg-[#5DCAA5]/15 border-[#5DCAA5] text-[#5DCAA5]'
            }`}
          >
            {isCapturing ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isCapturing ? 'Stop Audio' : 'Start Audio'}</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/30 rounded text-xs font-mono text-[#E5484D] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Oscilloscope Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={640}
          height={180}
          className="w-full h-44 bg-[#0F1214] rounded border border-[#262D31]"
          aria-label="Real-time audio waveform canvas"
        />

        {/* Level & Clipping Overlays */}
        {isCapturing && (
          <div className="absolute top-2 right-2 flex items-center gap-2 text-[10px] font-mono">
            {/* Clipping Indicator */}
            <span
              className={`px-1.5 py-0.5 rounded border font-bold ${
                isClipping
                  ? 'bg-[#E5484D] text-black border-[#E5484D] animate-pulse'
                  : 'bg-[#0F1214] text-[#8A919A] border-[#262D31]'
              }`}
            >
              {isClipping ? 'CLIP' : 'HEADROOM OK'}
            </span>

            {/* Signal Level Meter */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0F1214] border border-[#262D31]">
              <span className="text-[#8A919A]">LVL:</span>
              <div className="w-16 h-1.5 bg-[#1C2226] rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-75 ${
                    audioLevel > 85 ? 'bg-[#E5484D]' : audioLevel > 50 ? 'bg-[#EF9F27]' : 'bg-[#5DCAA5]'
                  }`}
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
              <span className="text-[#E6E3DA] tabular-nums">{audioLevel}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Audio Subsystem Note */}
      <div className="text-[11px] font-mono text-[#8A919A] flex items-center justify-between pt-1 border-t border-[#1C2226]">
        <span>Constraint: Raw getUserMedia (echoCancellation, AGC, noiseSuppression disabled)</span>
        <span className="text-[#5DCAA5]">Continuous Analog Domain</span>
      </div>
    </section>
  );
}

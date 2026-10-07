import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import useAudioInput from '../../hooks/useAudioInput';

export default function AudioScope({ isDark = true }) {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isListening,
    startListening,
    stopListening,
    audioError,
    analyserRef,
  } = useAudioInput();

  const [mode, setMode] = useState('waveform'); // 'waveform' | 'fft'
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = isDark ? '#0B0E0F' : '#F4F1EA';
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = isDark ? '#1C2226' : '#EAE6DC';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (isListening && analyserRef.current) {
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (mode === 'waveform') {
          analyser.getByteTimeDomainData(dataArray);
          ctx.strokeStyle = '#5DCAA5';
          ctx.lineWidth = 1.5;
          ctx.beginPath();

          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += sliceWidth;
          }
          ctx.stroke();
        } else {
          // FFT Frequency Spectrum
          analyser.getByteFrequencyData(dataArray);
          const barWidth = (width / bufferLength) * 2.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * height;
            ctx.fillStyle = i < bufferLength / 2 ? '#378ADD' : '#EF9F27';
            ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
            x += barWidth;
          }
        }
      } else {
        // Synthesize gentle baseline acoustic trace when mic is in standby
        phase += 0.05;
        ctx.strokeStyle = '#8A919A';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.05 + phase) * 8 * Math.cos(x * 0.02);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (isListening && analyserRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isListening, mode, isDark, analyserRef]);

  return (
    <div className="w-full bg-[#151A1D] border border-[#262D31] rounded-[4px] p-4 flex flex-col gap-3">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#262D31] gap-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#5DCAA5]" />
          <h3 className="text-xs font-semibold text-[#E6E3DA] font-mono">
            Direct Web Audio Transducer Oscilloscope
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-[#262D31] rounded-[2px] p-0.5 bg-[#0F1214]">
            <button
              type="button"
              onClick={() => setMode('waveform')}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] ${
                mode === 'waveform' ? 'bg-[#1C2226] text-[#E6E3DA] font-bold' : 'text-[#8A919A]'
              }`}
            >
              Time Domain (Oscilloscope)
            </button>
            <button
              type="button"
              onClick={() => setMode('fft')}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] ${
                mode === 'fft' ? 'bg-[#1C2226] text-[#E6E3DA] font-bold' : 'text-[#8A919A]'
              }`}
            >
              FFT Spectrum (300–3.4 kHz)
            </button>
          </div>

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-[2px] border flex items-center gap-1.5 transition-colors ${
              isListening
                ? 'bg-[#E5484D] text-white border-[#E5484D]'
                : 'bg-[#1C2226] text-[#5DCAA5] border-[#262D31] hover:border-[#5DCAA5]'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Stop Input</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Acquire Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Device Selector & Settings Warning */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-[#8A919A] gap-2">
        <div className="flex items-center gap-2">
          <span>SOURCE HARDWARE:</span>
          {devices.length > 0 ? (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-[#0F1214] text-[#E6E3DA] border border-[#262D31] rounded-[2px] px-2 py-0.5 text-[10px]"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Audio Device ${d.deviceId.slice(0, 6)}`}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-[#E6E3DA]">Standard System Transducer (Unprocessed)</span>
          )}
        </div>

        <div className="text-[9px] text-[#5DCAA5]">
          ECHO_CANCEL: OFF • NOISE_SUPPRESS: OFF • AGC: OFF
        </div>
      </div>

      {audioError && (
        <div className="p-2 bg-[#E5484D]/10 border border-[#E5484D]/30 text-[#E5484D] text-[11px] font-mono rounded-[2px]">
          {audioError}
        </div>
      )}

      {/* Canvas */}
      <div className="w-full h-28 bg-[#0B0E0F] border border-[#262D31] rounded-[2px] overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={112}
          className="w-full h-full block"
          aria-label="Real-time Web Audio oscilloscope showing audio frequency content in human speech band"
        />
      </div>
    </div>
  );
}

AudioScope.propTypes = {
  isDark: PropTypes.bool,
};

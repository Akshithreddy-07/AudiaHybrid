import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @typedef {Object} AudioDeviceInfo
 * @property {string} deviceId
 * @property {string} label
 */

/**
 * Hook for managing raw Web Audio microphone / line-in capture
 */
export function useAudioInput() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [error, setError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isClipping, setIsClipping] = useState(false);

  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const animFrameRef = useRef(null);

  // Enumerate input audio devices
  const updateDeviceList = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const allDevs = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevs
        .filter((d) => d.kind === 'audioinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone / Line In ${index + 1}`,
        }));

      setDevices(audioInputs);
      if (audioInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (_) {}
  }, [selectedDeviceId]);

  useEffect(() => {
    updateDeviceList();
    navigator.mediaDevices?.addEventListener('devicechange', updateDeviceList);
    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', updateDeviceList);
    };
  }, [updateDeviceList]);

  // Clean unmount helper
  const stopCapture = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsCapturing(false);
    setAudioLevel(0);
    setIsClipping(false);
  }, []);

  const startCapture = useCallback(async () => {
    stopCapture();
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Web Audio getUserMedia is not supported in this browser environment.');
      return;
    }

    try {
      const constraints = {
        audio: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
        },
        video: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;
      source.connect(analyser);

      setIsCapturing(true);
      await updateDeviceList();

      // Start level & clipping meter loop
      const timeData = new Float32Array(analyser.fftSize);
      let clipTimer = 0;

      const checkLevels = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(timeData);

        let peak = 0;
        let sumSq = 0;
        for (let i = 0; i < timeData.length; i++) {
          const val = Math.abs(timeData[i]);
          if (val > peak) peak = val;
          sumSq += val * val;
        }

        const rms = Math.sqrt(sumSq / timeData.length);
        const levelPct = Math.min(100, Math.round(rms * 250));
        setAudioLevel(levelPct);

        if (peak >= 0.98) {
          setIsClipping(true);
          clipTimer = Date.now();
        } else if (Date.now() - clipTimer > 600) {
          setIsClipping(false);
        }

        animFrameRef.current = requestAnimationFrame(checkLevels);
      };

      checkLevels();
    } catch (err) {
      stopCapture();
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Microphone permission denied. Grant browser audio access to view live waveforms.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No audio input device detected. Connect a USB sound card or microphone.');
        } else {
          setError(`Audio capture error: ${err.message}`);
        }
      } else {
        setError('Failed to initialize Web Audio hardware capture.');
      }
    }
  }, [selectedDeviceId, stopCapture, updateDeviceList]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    isCapturing,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    startCapture,
    stopCapture,
    error,
    analyserNode: analyserRef.current,
    audioLevel,
    isClipping,
  };
}

export default useAudioInput;

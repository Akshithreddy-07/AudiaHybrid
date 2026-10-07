import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useControls } from '../../context/ControlsContext.jsx';

export function Footer() {
  const { setShortcutsOpen } = useControls();

  return (
    <footer role="contentinfo" className="w-full bg-[#0F1214] border-t border-[#262D31] text-[#8A919A] text-xs font-mono mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[#E6E3DA] font-semibold">AudiaHybrid</span>
          <span>•</span>
          <span>Continuous Analog Audio Path (No DSP Delay)</span>
          <span>•</span>
          <span>ESP32 Wi-Fi / MQTT Diagnostic Pipeline</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={() => setShortcutsOpen(true)}
            className="hover:text-[#E6E3DA] transition-colors flex items-center gap-1 underline underline-offset-2"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Shortcuts (?)</span>
          </button>
          <span>KL University 25SC2008E</span>
        </div>
      </div>
    </footer>
  );
}

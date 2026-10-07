import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { useControls } from '../../context/ControlsContext.jsx';

export function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useControls();

  if (!shortcutsOpen) return null;

  const shortcuts = [
    { key: '1', desc: 'Set Link Focus to Both (Optical & RF)' },
    { key: '2', desc: 'Set Link Focus to Optical Only' },
    { key: '3', desc: 'Set Link Focus to RF Only' },
    { key: 'Space', desc: 'Pause / Resume live stream' },
    { key: 'T', desc: 'Toggle Color Theme (Dark / Light)' },
    { key: '?', desc: 'Toggle this Shortcuts Guide' },
    { key: 'Esc', desc: 'Close dialogs and popovers' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px] animate-fadeIn"
    >
      <div className="w-full max-w-md bg-[#151A1D] border border-[#262D31] rounded p-5 space-y-4 shadow-xl text-[#E6E3DA]">
        <div className="flex items-center justify-between border-b border-[#262D31] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#5DCAA5]">
            <Keyboard className="w-4 h-4" />
            <h2 id="shortcuts-title">Instrument Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="p-1 rounded text-[#8A919A] hover:text-[#E6E3DA] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5DCAA5]"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="divide-y divide-[#262D31] text-xs font-mono">
          {shortcuts.map((s) => (
            <li key={s.key} className="py-2.5 flex items-center justify-between">
              <span className="text-[#8A919A]">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[#0F1214] border border-[#262D31] text-[#E6E3DA] font-bold text-[11px]">
                {s.key}
              </kbd>
            </li>
          ))}
        </ul>

        <div className="pt-2 border-t border-[#262D31] flex justify-end">
          <button
            onClick={() => setShortcutsOpen(false)}
            className="px-3 py-1.5 rounded bg-[#262D31] text-xs font-mono text-[#E6E3DA] hover:bg-[#1C2226] transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Trash2 } from 'lucide-react';

export function EventLogTable({ events = [], onClear }) {
  return (
    <section aria-labelledby="event-log-title" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#8A919A]" />
          <h2 id="event-log-title" className="text-xs font-mono font-bold uppercase text-[#E6E3DA]">
            State Transitions & Event Log ({events.length} Entries)
          </h2>
        </div>

        {events.length > 0 && (
          <button
            onClick={onClear}
            className="text-[11px] font-mono text-[#8A919A] hover:text-[#E6E3DA] transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto max-h-52 overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#262D31] text-[#8A919A] sticky top-0 bg-[#151A1D]">
              <th className="py-1.5 px-2 w-28">Timestamp</th>
              <th className="py-1.5 px-2 w-32">Event Type</th>
              <th className="py-1.5 px-2">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C2226] text-[#E6E3DA]">
            {events.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-[#8A919A]">
                  No system transitions recorded in this session.
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#1C2226]/50">
                  <td className="py-1.5 px-2 text-[#8A919A] whitespace-nowrap text-[11px]">
                    {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour12: false }) : '—'}
                  </td>
                  <td className="py-1.5 px-2">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                        evt.type === 'STALE_WARNING'
                          ? 'bg-[#E5484D]/15 text-[#E5484D]'
                          : evt.type === 'RECOVERY'
                          ? 'bg-[#5DCAA5]/15 text-[#5DCAA5]'
                          : 'bg-[#378ADD]/15 text-[#378ADD]'
                      }`}
                    >
                      {evt.type}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-[11px] text-[#E6E3DA]">{evt.message}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

EventLogTable.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
      type: PropTypes.string,
      message: PropTypes.string,
    })
  ),
  onClear: PropTypes.func,
};

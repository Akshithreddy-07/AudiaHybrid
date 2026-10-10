import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Radio,
  Sun,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { useAudiaLive } from '../hooks/useAudiaLive.js';

/**
 * Sanitises raw string input to prevent rendering of control characters
 * @param {string|null|undefined} text
 * @returns {string}
 */
function sanitize(text) {
  if (text === null || text === undefined) return '';
  return String(text).replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
}

/**
 * Formats a timestamp into a clean 24h or localized time string
 * @param {string|number|Date} ts
 * @returns {string}
 */
function formatTime(ts) {
  if (!ts) return '—';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch (_) {
    return '—';
  }
}

export function TextLinkPanel() {
  const {
    brokerUp,
    deviceOnline,
    latestReceived,
    lastSent,
    textHistory = [],
    textMetrics = { optOk: 0, rfOk: 0, loss: 0, activeLink: 'NONE' },
    isSending,
    sendError,
    sendTextMessage,
  } = useAudiaLive();

  const [inputMessage, setInputMessage] = useState('');
  const [localError, setLocalError] = useState(null);

  const optOk = Number(textMetrics?.optOk ?? 0);
  const rfOk = Number(textMetrics?.rfOk ?? 0);
  const loss = Number(textMetrics?.loss ?? 0);
  const activeLink = String(textMetrics?.activeLink || 'NONE').toUpperCase();

  // Compute success rates safely
  const optTotal = optOk + loss;
  const optRate = optTotal > 0 ? Math.min(100, Math.max(0, Math.round((optOk / optTotal) * 100))) : (optOk > 0 ? 100 : 0);

  const rfTotal = rfOk + loss;
  const rfRate = rfTotal > 0 ? Math.min(100, Math.max(0, Math.round((rfOk / rfTotal) * 100))) : (rfOk > 0 ? 100 : 0);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    const trimmed = inputMessage.trim();
    if (!trimmed || isSending) return;

    setLocalError(null);
    try {
      await sendTextMessage(trimmed);
      setInputMessage('');
    } catch (err) {
      setLocalError(err.message || 'Failed to transmit message');
    }
  };

  const isSendDisabled = inputMessage.trim().length === 0 || isSending;

  return (
    <section
      aria-label="Text Link Communication Panel"
      className="bg-[#151A1D] border border-[#262D31] rounded-lg p-4 sm:p-5 space-y-4 shadow-lg shadow-black/20"
    >
      {/* 1. Header with Active Link & Connectivity Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#262D31]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#1C2226] border border-[#262D31] text-[#378ADD]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#E6E3DA] tracking-tight">
                Text Link Channel
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C2226] text-[#8A919A] border border-[#262D31]">
                MQTT audiahybrid/cyril-raj/cmd
              </span>
            </div>
            <p className="text-xs text-[#8A919A]">
              Bidirectional optical/RF text messaging and link packet diagnostics
            </p>
          </div>
        </div>

        {/* Status Badges & Active Link */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Link Badge */}
          <div className="flex items-center gap-1.5 bg-[#101416] border border-[#262D31] px-2.5 py-1 rounded">
            <span className="text-[11px] font-mono text-[#8A919A]">Active Link:</span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                activeLink === 'OPTICAL'
                  ? 'bg-[#378ADD]/20 text-[#378ADD] border border-[#378ADD]/40'
                  : activeLink === 'RF'
                  ? 'bg-[#EF9F27]/20 text-[#EF9F27] border border-[#EF9F27]/40'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              {activeLink || 'NONE'}
            </span>
          </div>

          {/* MQTT Broker Status */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border ${
              brokerUp
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                : 'bg-rose-950/40 text-rose-400 border-rose-800/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                brokerUp ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            {brokerUp ? 'MQTT Connected' : 'MQTT Disconnected'}
          </span>
        </div>
      </div>

      {/* Disconnection Warning Banner if Broker is Down */}
      {!brokerUp && (
        <div className="bg-rose-950/30 border border-rose-800/60 rounded p-3 text-rose-300 flex items-center gap-2.5 text-xs font-mono">
          <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">MQTT Broker Disconnected:</span> Reconnecting to HiveMQ broker... Direct command publishing and live telemetry streaming are temporarily unavailable.
          </div>
        </div>
      )}

      {/* 2. Top Grid: Transmit Section (Left) & Received Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (5 Cols): Text Input & Last Sent */}
        <div className="lg:col-span-6 bg-[#101416] border border-[#262D31] rounded p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A919A]">
              <span className="font-semibold text-[#E6E3DA] flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#5DCAA5]" />
                Transmit Text Command
              </span>
              <span className={`tabular-nums ${inputMessage.length >= 32 ? 'text-rose-400 font-bold' : 'text-[#8A919A]'}`}>
                {inputMessage.length} / 32
              </span>
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={32}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type message to send (max 32 chars)..."
                  className="flex-1 bg-[#0D1012] border border-[#262D31] focus:border-[#5DCAA5] rounded px-3 py-2 text-sm font-mono text-[#E6E3DA] placeholder-[#5B6068] outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSendDisabled}
                  className="px-4 py-2 bg-[#5DCAA5] hover:bg-[#4db392] disabled:opacity-40 disabled:hover:bg-[#5DCAA5] disabled:cursor-not-allowed text-[#0D1012] font-semibold font-mono text-sm rounded flex items-center gap-1.5 transition-colors shadow"
                >
                  {isSending ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>

              {(localError || sendError) && (
                <p className="text-xs font-mono text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {sanitize(localError || sendError)}
                </p>
              )}
            </form>
          </div>

          {/* Last Sent Line */}
          <div className="pt-2 border-t border-[#1C2226] text-xs font-mono">
            <div className="text-[#8A919A] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#8A919A]" />
                Last sent:
              </span>
              <span>{lastSent?.ts ? formatTime(lastSent.ts) : '—'}</span>
            </div>
            <div className="mt-1 font-mono text-sm text-[#E6E3DA] truncate bg-[#0D1012] px-2.5 py-1.5 rounded border border-[#1C2226]">
              {lastSent?.text ? (
                <span>&ldquo;{sanitize(lastSent.text)}&rdquo;</span>
              ) : (
                <span className="text-[#5B6068] italic">No messages sent yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (6 Cols): Received Message Box */}
        <div className="lg:col-span-6 bg-[#101416] border border-[#262D31] rounded p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A919A] pb-2 border-b border-[#1C2226]">
            <span className="font-semibold text-[#E6E3DA] flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[#378ADD]" />
              Latest Decoded Message (Telemetry)
            </span>
            <div className="flex items-center gap-2">
              {latestReceived?.link && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                    latestReceived.link.toUpperCase() === 'OPTICAL'
                      ? 'bg-[#378ADD]/20 text-[#378ADD] border-[#378ADD]/40'
                      : latestReceived.link.toUpperCase() === 'RF'
                      ? 'bg-[#EF9F27]/20 text-[#EF9F27] border-[#EF9F27]/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {sanitize(latestReceived.link)}
                </span>
              )}
              <span className="text-[11px] text-[#8A919A]">
                {latestReceived?.ts ? formatTime(latestReceived.ts) : ''}
              </span>
            </div>
          </div>

          {/* Received Content Area */}
          <div className="min-h-[72px] flex items-center justify-center bg-[#0D1012] border border-[#1C2226] rounded p-3">
            {latestReceived?.msg ? (
              <div className="w-full text-left space-y-1">
                <div className="text-lg font-mono font-bold text-[#5DCAA5] tracking-wide break-all">
                  {sanitize(latestReceived.msg)}
                </div>
                <div className="text-[11px] font-mono text-[#8A919A] flex items-center justify-between">
                  <span>
                    Channel: <strong className={latestReceived.link?.toUpperCase() === 'OPTICAL' ? 'text-[#378ADD]' : 'text-[#EF9F27]'}>{sanitize(latestReceived.link || 'AUTO')}</strong>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Packet Valid
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs font-mono text-[#5B6068]">
                No message received yet. Waiting for incoming telemetry...
              </div>
            )}
          </div>

          {/* Micro Telemetry Stats row */}
          <div className="text-[11px] font-mono text-[#8A919A] flex items-center justify-between pt-1">
            <span>Payload Parser: <strong className="text-[#E6E3DA]">Active</strong></span>
            <span>Packet Loss: <strong className={loss > 0 ? 'text-amber-400' : 'text-emerald-400'}>{loss}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Link Success-Rate Bars Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* OPTICAL Success Rate Bar (Blue) */}
        <div className="bg-[#101416] border border-[#262D31] border-l-4 border-l-[#378ADD] rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#378ADD] font-semibold">
              <Sun className="w-3.5 h-3.5" />
              OPTICAL Link Success Rate
            </span>
            <span className="text-xs font-mono text-[#E6E3DA] font-bold">
              {optRate}%
            </span>
          </div>

          {/* Bar */}
          <div className="w-full bg-[#1C2226] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#378ADD] h-full transition-all duration-500 rounded-full"
              style={{ width: `${optRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#8A919A]">
            <span>Success: {optOk} pkts</span>
            <span>Loss: {loss} pkts</span>
            <span>Total: {optTotal}</span>
          </div>
        </div>

        {/* RF Success Rate Bar (Orange) */}
        <div className="bg-[#101416] border border-[#262D31] border-l-4 border-l-[#EF9F27] rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#EF9F27] font-semibold">
              <Radio className="w-3.5 h-3.5" />
              RF Link Success Rate
            </span>
            <span className="text-xs font-mono text-[#E6E3DA] font-bold">
              {rfRate}%
            </span>
          </div>

          {/* Bar */}
          <div className="w-full bg-[#1C2226] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#EF9F27] h-full transition-all duration-500 rounded-full"
              style={{ width: `${rfRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#8A919A]">
            <span>Success: {rfOk} pkts</span>
            <span>Loss: {loss} pkts</span>
            <span>Total: {rfTotal}</span>
          </div>
        </div>
      </div>

      {/* 4. History Table of Last 20 Messages */}
      <div className="bg-[#101416] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8A919A]" />
            <h3 className="text-xs font-mono font-bold uppercase text-[#E6E3DA]">
              Text Message Log (Last {Math.min(textHistory.length, 20)} Messages)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#8A919A]">
            SQLite + Live Ingest
          </span>
        </div>

        <div className="overflow-x-auto max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262D31] text-[#8A919A] sticky top-0 bg-[#101416] z-10">
                <th className="py-2 px-3 w-24">Time</th>
                <th className="py-2 px-3">Sent Text</th>
                <th className="py-2 px-3">Received Text</th>
                <th className="py-2 px-3 w-28">Link</th>
                <th className="py-2 px-3 w-20 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2226] text-[#E6E3DA]">
              {textHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#8A919A]">
                    No text messages recorded in this session.
                  </td>
                </tr>
              ) : (
                textHistory.slice(0, 20).map((msg, index) => {
                  const isOk = msg.ok !== false;
                  const linkType = msg.link ? String(msg.link).toUpperCase() : null;

                  return (
                    <tr key={msg.id || index} className="hover:bg-[#1C2226]/50 transition-colors">
                      {/* Time */}
                      <td className="py-2 px-3 text-[#8A919A] whitespace-nowrap text-[11px]">
                        {formatTime(msg.createdAt)}
                      </td>

                      {/* Sent Text */}
                      <td className="py-2 px-3 text-[11px] font-mono max-w-[160px] truncate">
                        {msg.sent ? (
                          <span className="text-[#E6E3DA]">&ldquo;{sanitize(msg.sent)}&rdquo;</span>
                        ) : (
                          <span className="text-[#5B6068]">—</span>
                        )}
                      </td>

                      {/* Received Text */}
                      <td className="py-2 px-3 text-[11px] font-mono max-w-[160px] truncate">
                        {msg.received ? (
                          <span className="text-[#5DCAA5] font-semibold">&ldquo;{sanitize(msg.received)}&rdquo;</span>
                        ) : (
                          <span className="text-[#5B6068]">—</span>
                        )}
                      </td>

                      {/* Link */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        {linkType ? (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${
                              linkType === 'OPTICAL'
                                ? 'bg-[#378ADD]/20 text-[#378ADD] border-[#378ADD]/40'
                                : linkType === 'RF'
                                ? 'bg-[#EF9F27]/20 text-[#EF9F27] border-[#EF9F27]/40'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}
                          >
                            {linkType}
                          </span>
                        ) : (
                          <span className="text-[#5B6068] text-[11px]">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isOk
                              ? 'bg-[#5DCAA5]/15 text-[#5DCAA5]'
                              : 'bg-[#E5484D]/15 text-[#E5484D]'
                          }`}
                        >
                          {isOk ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isOk ? 'OK' : 'FAILED'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

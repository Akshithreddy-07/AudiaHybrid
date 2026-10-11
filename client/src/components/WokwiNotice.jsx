import { useState } from "react";

const REPO_URL = "https://github.com/Akshithreddy-07/AudiaHybrid";
const STORAGE_KEY = "audiahybrid:wokwi-notice-dismissed";

function readDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function WokwiNotice({ deviceOnline = false }) {
  const [dismissed, setDismissed] = useState(readDismissed);
  const [expanded, setExpanded] = useState(false);

  if (dismissed || deviceOnline) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable, notice reappears next visit */
    }
    setDismissed(true);
  };

  return (
    <div
      role="note"
      className="border-b border-slate-800 bg-slate-900/80 text-sm text-slate-300"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full bg-emerald-400"
        />
        <p className="min-w-0 flex-1">
          Live data appears when the Wokwi simulator is running. Without it,
          the device panel shows as offline.{" "}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="wokwi-notice-steps"
            className="font-medium text-emerald-300 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {expanded ? "Hide steps" : "How to run it live"}
          </button>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notice"
          className="rounded p-1 text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {expanded && (
        <div id="wokwi-notice-steps" className="border-t border-slate-800">
          <ol className="mx-auto max-w-7xl list-decimal space-y-1.5 px-4 py-3 pl-9 text-slate-300 marker:text-emerald-400">
            <li>
              Clone the project:{" "}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                git clone {REPO_URL}.git
              </code>
            </li>
            <li>
              Open the <code className="font-mono text-xs text-emerald-300">firmware</code>{" "}
              folder in VS Code with the PlatformIO and Wokwi extensions, then
              build it.
            </li>
            <li>
              Run <span className="text-slate-100">Wokwi: Start Simulator</span>.
              This page switches to ESP32 Online and starts streaming.
            </li>
            <li>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline-offset-2 hover:underline"
              >
                Open the repo on GitHub
              </a>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
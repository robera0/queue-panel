import type { Caller } from "../types/queue";

interface CallerRowProps {
  caller: Caller;
  onHangup: (caller: Caller) => void;
  busy: boolean;
}

export function CallerRow({ caller, onHangup, busy }: CallerRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-console-800 last:border-0 font-mono text-xs">
      <span className="min-w-0 truncate text-console-300">
        {caller.caller_id || "Unknown"}
      </span>
      <span className="shrink-0 text-console-500">#{caller.position}</span>
      <span className="shrink-0 text-signal-amber">{caller.wait_time}s</span>
      <button
        type="button"
        disabled={busy}
        onClick={() => onHangup(caller)}
        className="shrink-0 rounded-md bg-console-700 px-2 py-0.5 text-[11px] text-console-300 transition-colors hover:bg-signal-red/25 hover:text-signal-red disabled:opacity-40"
      >
        Hang up
      </button>
    </div>
  );
}

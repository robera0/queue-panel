interface HeaderProps {
  connected: boolean;
  lastUpdated: Date | null;
  queueCount: number;
}

function formatClock(d: Date | null): string {
  if (!d) return "--:--:--";
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

export function Header({ connected, lastUpdated, queueCount }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-console-700 bg-console-900 px-6 py-4">
      <div className="flex items-baseline gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-console-200">
          Queue Room
        </h1>
        <span className="font-mono text-xs text-console-500">
          {queueCount} {queueCount === 1 ? "queue" : "queues"}
        </span>
      </div>

      <div className="flex items-center gap-4 font-mono text-xs text-console-500">
        <span>{formatClock(lastUpdated)}</span>
        <span className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              connected ? "bg-signal-green" : "bg-signal-red"
            }`}
          />
          {connected ? "live" : "disconnected"}
        </span>
      </div>
    </header>
  );
}

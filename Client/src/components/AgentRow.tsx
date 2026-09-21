import type { Agent } from "../types/queue";

interface AgentRowProps {
  agent: Agent;
  queueName: string;
  onTogglePause: (agent: Agent, queueName: string, nextPaused: boolean) => void;
  busy: boolean;
}

const STATUS_LABEL: Record<number, string> = {
  1: "Idle",
  2: "On call",
  5: "Unavailable",
};

function statusColor(status: number): string {
  if (status === 2) return "bg-signal-amber";
  if (status === 5) return "bg-signal-red";
  return "bg-signal-green";
}

export function AgentRow({ agent, queueName, onTogglePause, busy }: AgentRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-console-800 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusColor(agent.status)}`} />
        <div className="min-w-0">
          <p className="truncate text-sm text-console-300">{agent.name ?? agent.location}</p>
          <p className="truncate font-mono text-[11px] text-console-500">
            {STATUS_LABEL[agent.status] ?? "Unknown"}
            {agent.paused ? ` · paused (${agent.pause_reason})` : ""}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => onTogglePause(agent, queueName, !agent.paused)}
        className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors disabled:opacity-40 ${
          agent.paused
            ? "bg-signal-green/10 text-signal-green hover:bg-signal-green/20"
            : "bg-console-700 text-console-300 hover:bg-console-600"
        }`}
      >
        {agent.paused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}

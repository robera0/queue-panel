import type { Agent, Caller, Queue } from "../types/queue";
import { AgentRow } from "./AgentRow";
import { CallerRow } from "./CallerRow";

interface QueueCardProps {
  queue: Queue;
  onTogglePause: (agent: Agent, queueName: string, nextPaused: boolean) => void;
  pausingKey: string | null;
  onHangup: (caller: Caller, queueName: string) => void;
  hangingUpKey: string | null;
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div>
      <p className={`font-mono text-xl font-semibold ${tone ?? "text-console-300"}`}>{value}</p>
      <p className="text-[11px] text-console-500">{label}</p>
    </div>
  );
}

export function QueueCard({ queue, onTogglePause, pausingKey, onHangup, hangingUpKey }: QueueCardProps) {
  const availableAgents = queue.agents.filter((a) => a.status === 1 && !a.paused).length;

  return (
    <section className="flex flex-col rounded-lg border border-console-800 bg-console-850 shadow-panel">
      <div className="flex items-start justify-between px-5 py-4 border-b border-console-800">
        <div>
          <h2 className="text-base font-semibold text-console-200">{queue.name}</h2>
          <p className="mt-0.5 font-mono text-[11px] text-console-500">
            {availableAgents} of {queue.agents.length} agents free
          </p>
        </div>
        <span
          className={`rounded px-2 py-0.5 font-mono text-[11px] border ${
            queue.calls_waiting > 0
              ? "border-signal-amber/30 bg-signal-amber/10 text-signal-amber"
              : "border-signal-green/25 bg-signal-green/10 text-signal-green"
          }`}
        >
          {queue.calls_waiting > 0 ? `${queue.calls_waiting} waiting` : "clear"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 px-5 py-4 border-b border-console-800">
        <Stat label="Waiting" value={queue.calls_waiting} tone="text-signal-amber" />
        <Stat label="Completed" value={queue.completed} />
        <Stat label="Abandoned" value={queue.abandoned} tone="text-signal-red" />
        <Stat label="Service lvl" value={queue.service_level} tone="text-signal-info" />
      </div>

      <div className="grid flex-1 grid-cols-2 gap-0 divide-x divide-console-800">
        <div className="px-5 py-4">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-console-500">
            Agents
          </p>
          {queue.agents.length === 0 ? (
            <p className="text-sm text-console-500">No agents logged in</p>
          ) : (
            queue.agents.map((agent) => (
              <AgentRow
                key={agent.location}
                agent={agent}
                queueName={queue.name}
                onTogglePause={onTogglePause}
                busy={pausingKey === `${queue.name}:${agent.location}`}
              />
            ))
          )}
        </div>

        <div className="px-5 py-4">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-console-500">
            Callers
          </p>
          {queue.callers.length === 0 ? (
            <p className="text-sm text-console-500">Nobody waiting</p>
          ) : (
            queue.callers.map((caller, i) => (
              <CallerRow
                key={caller.channel ?? `${caller.caller_id}-${i}`}
                caller={caller}
                onHangup={(c) => onHangup(c, queue.name)}
                busy={hangingUpKey === `${queue.name}:${caller.channel ?? caller.caller_id}`}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

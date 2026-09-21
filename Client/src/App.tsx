import { useState } from "react";
import { Header } from "./components/Header";
import { QueueCard } from "./components/QueueCard";
import { useQueues } from "./hooks/useQueues";
import { setAgentPause, hangupCall, ApiError } from "./api/client";
import type { Agent, Caller } from "./types/queue";

export default function App() {
  const { queues, loading, error, lastUpdated, refresh } = useQueues();
  const [pausingKey, setPausingKey] = useState<string | null>(null);
  const [hangingUpKey, setHangingUpKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const queueList = Object.values(queues);

  async function handleTogglePause(agent: Agent, queueName: string, nextPaused: boolean) {
    const key = `${queueName}:${agent.location}`;
    setPausingKey(key);
    setActionError(null);
    try {
      await setAgentPause({
        interface: agent.location,
        queue: queueName,
        paused: nextPaused,
        reason: nextPaused ? "Break" : undefined,
      });
      await refresh();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Couldn't update agent status");
    } finally {
      setPausingKey(null);
    }
  }

  async function handleHangup(caller: Caller, queueName: string) {
    if (!caller.channel) {
      setActionError(
        "This caller has no channel on record — ami.py needs to include 'Channel' when it parses QueueEntry events."
      );
      return;
    }
    const key = `${queueName}:${caller.channel}`;
    setHangingUpKey(key);
    setActionError(null);
    try {
      await hangupCall(caller.channel);
      await refresh();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Couldn't hang up the call");
    } finally {
      setHangingUpKey(null);
    }
  }

  return (
    <div className="min-h-screen bg-console-950 text-console-300">
      <Header connected={!error} lastUpdated={lastUpdated} queueCount={queueList.length} />

      <main className="mx-auto max-w-6xl px-6 py-6">
        {error && (
          <div className="mb-5 rounded-lg border border-signal-red/30 bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
            {error}
          </div>
        )}
        {actionError && (
          <div className="mb-5 rounded-lg border border-signal-amber/30 bg-signal-amber/10 px-4 py-3 text-sm text-signal-amber">
            {actionError}
          </div>
        )}

        {loading && queueList.length === 0 && (
          <p className="font-mono text-sm text-console-500">Connecting to queue server…</p>
        )}

        {!loading && queueList.length === 0 && !error && (
          <p className="font-mono text-sm text-console-500">
            No queues reported yet. Confirm Asterisk manager.conf has the queue_backend user
            enabled.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {queueList.map((queue) => (
            <QueueCard
              key={queue.name}
              queue={queue}
              onTogglePause={handleTogglePause}
              pausingKey={pausingKey}
              onHangup={handleHangup}
              hangingUpKey={hangingUpKey}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

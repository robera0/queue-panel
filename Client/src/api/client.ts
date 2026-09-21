import type { ApiEnvelope, QueuesResponse } from "../types/queue";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("Can't reach the queue server. Is app.py running?");
  }

  const body = (await res
    .json()
    .catch(() => null)) as ApiEnvelope<unknown> | null;

  if (!res.ok || body?.status === "error") {
    throw new ApiError(
      body?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  }
  return body as T;
}

// GET /api/queues
export function fetchQueues(): Promise<ApiEnvelope<QueuesResponse>> {
  return request<ApiEnvelope<QueuesResponse>>("/api/queues");
}

// POST /api/agent/pause
export function setAgentPause(args: {
  interface: string;
  queue: string;
  reason?: string;
  paused: boolean;
}): Promise<ApiEnvelope<null>> {
  return request<ApiEnvelope<null>>("/api/agent/pause", {
    method: "POST",
    body: JSON.stringify({
      interface: args.interface,
      queue: args.queue,
      reason: args.reason ?? "Break",
      paused: args.paused,
    }),
  });
}

// POST /api/call/hangup
export function hangupCall(channel: string): Promise<ApiEnvelope<null>> {
  return request<ApiEnvelope<null>>("/api/call/hangup", {
    method: "POST",
    body: JSON.stringify({ channel }),
  });
}

export { ApiError };

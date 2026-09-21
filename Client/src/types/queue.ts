// Mirrors ami.py -> AMIConnector.get_queue_data()

export type AgentStatus = 1 | 2 | 5 | number; // 1=Idle, 2=InUse, 5=Unavailable

export interface Agent {
  name: string;
  location: string;
  status: AgentStatus;
  paused: boolean;
  pause_reason: string;
}

export interface Caller {
  caller_id: string;
  position: string;
  wait_time: string;
  // Not currently emitted by ami.py's QueueEntry parsing — add
  // 'channel': event_dict.get('Channel') there to enable hangup.
  channel?: string;
}

export interface Queue {
  name: string;
  calls_waiting: number;
  completed: number;
  abandoned: number;
  service_level: string; // e.g. "87.5%"
  agents: Agent[];
  callers: Caller[];
}

// GET /api/queues -> { status: 'success', data: { [queueName]: Queue } }
export type QueuesResponse = Record<string, Queue>;

export interface ApiEnvelope<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

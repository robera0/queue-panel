import { useCallback, useEffect, useRef, useState } from "react";
import { fetchQueues, ApiError } from "../api/client";
import type { QueuesResponse } from "../types/queue";

interface UseQueuesResult {
  queues: QueuesResponse;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

const POLL_MS = 4000;

export function useQueues(): UseQueuesResult {
  const [queues, setQueues] = useState<QueuesResponse>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const load = useCallback(async () => {
    try {
      const res = await fetchQueues();
      setQueues(res.data ?? {});
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Unexpected error loading queues");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timer.current = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(timer.current);
  }, [load]);

  return { queues, loading, error, lastUpdated, refresh: load };
}

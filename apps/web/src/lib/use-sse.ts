import { useEffect, useRef, useState } from "react";

const MAX_HISTORY = 60;

/**
 * Subscribe to a Server-Sent Events endpoint.
 * Returns the latest data point and a ring buffer of up to 60 entries.
 */
export function useSSE<T>(url: string | null): { data: T | null; history: T[] } {
  const [data, setData] = useState<T | null>(null);
  const [history, setHistory] = useState<T[]>([]);
  const historyRef = useRef<T[]>([]);

  useEffect(() => {
    if (!url) return;

    const source = new EventSource(url);

    source.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as T;
        setData(parsed);

        const next = [...historyRef.current, parsed];
        if (next.length > MAX_HISTORY) {
          next.splice(0, next.length - MAX_HISTORY);
        }
        historyRef.current = next;
        setHistory(next);
      } catch {
        // Ignore malformed data
      }
    };

    source.onerror = () => {
      // EventSource auto-reconnects; nothing to do
    };

    return () => {
      source.close();
      historyRef.current = [];
    };
  }, [url]);

  return { data, history };
}

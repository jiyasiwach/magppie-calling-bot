"use client";

import { useEffect } from "react";
import { useCallStore } from "@/store/callStore";
import type { ClientEvent, ServerEvent } from "@/lib/types";
import { playDemo } from "@/lib/demoCall";

/* The screen opens one websocket, listens, and paints. The only messages
   it sends back are takeover.request / takeover.release. If the socket
   drops it reconnects automatically and says so on screen rather than
   sitting there looking connected.

   With no NEXT_PUBLIC_WS_URL configured (the state today, before the
   FastAPI socket exists), it runs the scripted demo instead so the whole
   screen works from `npm run dev`. Delete demoCall.ts and this branch
   once the backend is live. */

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export function useSocket() {
  const ingest = useCallStore((s) => s.ingest);
  const bindSender = useCallStore((s) => s.bindSender);
  const setConnection = useCallStore((s) => s.setConnection);

  useEffect(() => {
    // ---- demo mode ------------------------------------------------
    if (!WS_URL) {
      const emit = (e: ServerEvent) => ingest(e);

      // a stand-in backend: answer takeover requests so the orb is live
      const demoTimers: ReturnType<typeof setTimeout>[] = [];
      bindSender((e: ClientEvent) => {
        if (e.type === "takeover.request") {
          demoTimers.push(
            setTimeout(() => emit({ type: "takeover.granted" }), 650),
            setTimeout(
              () => emit({ type: "agent.state", state: "human" }),
              700,
            ),
          );
        } else if (e.type === "takeover.release") {
          demoTimers.push(
            setTimeout(
              () => emit({ type: "agent.state", state: "idle" }),
              400,
            ),
          );
        }
      });

      const cancel = playDemo(emit, () => setConnection("open"));
      return () => {
        cancel();
        demoTimers.forEach(clearTimeout);
      };
    }

    // ---- live mode ------------------------------------------------
    let ws: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;
    let closedByUs = false;

    const connect = () => {
      setConnection(attempts === 0 ? "connecting" : "reconnecting");
      ws = new WebSocket(WS_URL);

      bindSender((e: ClientEvent) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(e));
        }
      });

      ws.onopen = () => {
        attempts = 0;
        setConnection("open");
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as ServerEvent;
          ingest(data);
        } catch {
          // ignore malformed frames rather than crash the paint loop
        }
      };

      ws.onclose = () => {
        if (closedByUs) return;
        attempts += 1;
        setConnection("reconnecting");
        // capped exponential backoff
        const delay = Math.min(1000 * 2 ** (attempts - 1), 15000);
        retry = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      closedByUs = true;
      if (retry) clearTimeout(retry);
      ws?.close();
      setConnection("closed");
    };
  }, [ingest, bindSender, setConnection]);
}

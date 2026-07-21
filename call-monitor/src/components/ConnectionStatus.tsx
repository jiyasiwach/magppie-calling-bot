"use client";

import { motion } from "framer-motion";
import { useCallStore } from "@/store/callStore";

/* Say so on screen when the socket isn't healthy, rather than sitting
   there looking connected. Silent when open. */

const COPY: Record<string, string> = {
  connecting: "Connecting…",
  reconnecting: "Reconnecting…",
  closed: "Disconnected",
};

export function ConnectionStatus() {
  const connection = useCallStore((s) => s.connection);
  if (connection === "open") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass pointer-events-none absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-1.5"
      role="status"
    >
      <span className="h-2 w-2 rounded-full bg-sand motion-safe:animate-pulse" />
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-sand">
        {COPY[connection] ?? connection}
      </span>
    </motion.div>
  );
}

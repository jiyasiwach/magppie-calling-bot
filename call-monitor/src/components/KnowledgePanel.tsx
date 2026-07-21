"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KB } from "@/lib/kb";
import { useCallStore } from "@/store/callStore";

/* The knowledge box. Not a file viewer — its whole reason for being on
   this screen is that when a kb.hit arrives, that chunk lights brass and
   scrolls itself into view, so someone watching can hear Pooja answer and
   see what she's answering from in the same second. */

export function KnowledgePanel({ open }: { open: boolean }) {
  const activeChunkId = useCallStore((s) => s.activeChunkId);
  const kbHitSeq = useCallStore((s) => s.kbHitSeq);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // scroll the freshly-hit chunk into view — even on a repeat hit, hence
  // the seq dependency rather than the id.
  useEffect(() => {
    if (!open || !activeChunkId) return;
    const el = cardRefs.current.get(activeChunkId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [kbHitSeq, activeChunkId, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="kb"
          initial={{ opacity: 0, x: -16, width: 0 }}
          animate={{ opacity: 1, x: 0, width: 330 }}
          exit={{ opacity: 0, x: -16, width: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="glass ml-3 flex h-full flex-col overflow-hidden rounded-2xl"
          style={{ width: 330 }}
          aria-label="Knowledge base"
        >
          <header className="flex items-center justify-between px-4 pb-3 pt-4">
            <h2 className="font-sans text-[13px] font-semibold tracking-wide text-bone">
              Knowledge base
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sand/70">
              answers from
            </span>
          </header>

          <div className="panel-scroll flex-1 overflow-y-auto px-3 pb-4">
            {KB.map((file) => (
              <section key={file.file} className="mb-4">
                <div className="mb-2 flex items-baseline gap-2 px-1">
                  <span className="font-mono text-[10px] text-sand/70">
                    {file.file}
                  </span>
                </div>
                <div className="space-y-2">
                  {file.chunks.map((c) => {
                    const active = c.id === activeChunkId;
                    return (
                      <div
                        key={c.id}
                        ref={(el) => {
                          if (el) cardRefs.current.set(c.id, el);
                          else cardRefs.current.delete(c.id);
                        }}
                        className={`rounded-xl border p-3 transition-colors duration-500 ${
                          active
                            ? "border-brass/70 bg-brass/12"
                            : "hairline border bg-cast/30"
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3
                            className={`font-sans text-[13px] font-medium ${
                              active ? "text-bone" : "text-bone/90"
                            }`}
                          >
                            {c.heading}
                          </h3>
                          <span
                            className={`font-mono text-[9px] tracking-wide ${
                              active ? "text-brass" : "text-sand/50"
                            }`}
                          >
                            {c.id}
                          </span>
                        </div>
                        <p className="font-sans text-[12px] leading-relaxed text-sand">
                          {c.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

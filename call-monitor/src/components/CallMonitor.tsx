"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { useSocket } from "@/lib/useSocket";
import { useCallStore } from "@/store/callStore";
import { KitchenBackdrop } from "@/components/KitchenBackdrop";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { LeftRail } from "@/components/LeftRail";
import { KnowledgePanel } from "@/components/KnowledgePanel";
import { HobOrb } from "@/components/HobOrb";
import { CallFacts } from "@/components/CallFacts";
import { Transcript } from "@/components/Transcript";

/* The whole screen. Full viewport, nothing scrolls except the two panels.
   Three pieces of frosted glass float on the kitchen with a gap between
   them so the kitchen breathes through. */

export function CallMonitor() {
  useSocket();

  const [kbOpen, setKbOpen] = useState(false);
  const kbHitSeq = useCallStore((s) => s.kbHitSeq);

  // brass dot on the rail control when a hit lands while the panel is
  // closed. Opening the panel marks everything seen.
  const seenSeq = useRef(0);
  const [unseenHit, setUnseenHit] = useState(false);

  useEffect(() => {
    if (kbOpen) {
      seenSeq.current = kbHitSeq;
      setUnseenHit(false);
    } else if (kbHitSeq > seenSeq.current) {
      setUnseenHit(true);
    }
  }, [kbHitSeq, kbOpen]);

  return (
    <MotionConfig reducedMotion="user">
    <main className="fixed inset-0 flex items-stretch gap-3 p-3">
      <KitchenBackdrop />
      <ConnectionStatus />

      {/* left cluster: the rail, and the KB panel that slides out beside it */}
      <div className="flex h-full items-stretch">
        <LeftRail
          kbOpen={kbOpen}
          unseenHit={unseenHit}
          onToggleKb={() => setKbOpen((v) => !v)}
        />
        <KnowledgePanel open={kbOpen} />
      </div>

      {/* centre: the orb, big, with one line of call facts under it */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8">
        <HobOrb />
        <CallFacts />
      </section>

      {/* right: the transcript */}
      <Transcript />
    </main>
    </MotionConfig>
  );
}

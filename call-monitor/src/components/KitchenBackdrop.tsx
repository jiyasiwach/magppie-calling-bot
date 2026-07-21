"use client";

import { useEffect, useRef, useState } from "react";

/* The kitchen is the page; everything else is glass resting on it. Play
   it muted, looping, at about a third speed, graded down hard. Pause it
   and show the still for anyone with reduced motion on.

   Expects /kitchen-loop.mp4 with /kitchen-poster.jpg. If the video is
   absent the poster (or the plain grade) shows and the screen never
   breaks. */

export function KitchenBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      return;
    }
    // about a third speed. Set it now in case metadata is already in (the
    // event won't fire again), and on every load in case it resets.
    const slow = () => {
      v.playbackRate = 0.33;
    };
    slow();
    v.addEventListener("loadedmetadata", slow);
    v.addEventListener("play", slow);
    // best-effort autoplay; muted so browsers allow it
    v.play().catch(() => {});
    return () => {
      v.removeEventListener("loadedmetadata", slow);
      v.removeEventListener("play", slow);
    };
  }, [reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-cast-deep">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/kitchen-loop.mp4"
        poster="/kitchen-poster.jpg"
        muted
        loop
        playsInline
        autoPlay={!reducedMotion}
        preload="metadata"
      />
      {/* the grade: darken hard and pull toward the warm near-black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 30%, rgba(20,18,15,0.35) 0%, rgba(11,10,8,0.72) 60%, rgba(11,10,8,0.9) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-cast-deep/30" />
    </div>
  );
}

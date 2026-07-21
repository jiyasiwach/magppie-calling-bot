"use client";

import { useEffect, useState } from "react";

/* The Magppie mark, taken from the brand's own square monogram
   (magppie.com's favicon). The source glyph is black on transparent, so
   we paint it with a mask rather than an <img> — that way it renders in
   bone and sits on the dark glass instead of disappearing into it.

   Falls back to a text wordmark if the file is absent, so the screen
   never breaks. */

const MARK = "/magppie-mark.png";

export function Logo({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onerror = () => setFailed(true);
    img.src = MARK;
  }, []);

  if (failed) {
    return (
      <span
        className={`font-sans text-[13px] font-semibold tracking-[0.14em] text-bone ${className}`}
      >
        M<span className="sr-only">agppie</span>
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="Magppie"
      title="Magppie"
      className={`block h-8 w-8 bg-bone ${className}`}
      style={{
        maskImage: `url(${MARK})`,
        WebkitMaskImage: `url(${MARK})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { FlowStage } from "@/data/projects";

export default function FlowDiagram({ stages }: { stages: FlowStage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const updateFades = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateFades();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateFades);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stages]);

  return (
    <div className="w-full">
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateFades}
          className="overflow-x-auto rounded-xl border border-border bg-background px-8 py-8"
          onMouseLeave={() => setActive(null)}
        >
          <div className="flex w-max items-start gap-0">
            {stages.map((stage, i) => (
              <div key={i} className="flex items-start">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`w-64 shrink-0 rounded-lg border px-4 py-3 text-left transition-colors ${
                    active === i
                      ? "border-accent bg-surface-2"
                      : "border-border bg-surface hover:border-accent-soft"
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
                      {i + 1}
                    </span>
                    <span className="font-heading text-sm font-medium leading-tight text-foreground">
                      {stage.label}
                    </span>
                  </div>
                  <p className="text-xs leading-snug text-muted">{stage.description}</p>
                </button>

                {i < stages.length - 1 && (
                  <div className="flex h-[72px] w-10 shrink-0 items-center justify-center">
                    <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
                      <line
                        x1="0"
                        y1="8"
                        x2="30"
                        y2="8"
                        stroke={active === i || active === i + 1 ? "var(--accent)" : "var(--border)"}
                        strokeWidth="1.5"
                      />
                      <path
                        d="M30 3L36 8L30 13"
                        stroke={active === i || active === i + 1 ? "var(--accent)" : "var(--border)"}
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 rounded-l-xl bg-gradient-to-r from-background to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 rounded-r-xl bg-gradient-to-l from-background to-transparent" />
        )}
      </div>
      <p className="mt-2 text-xs text-muted">Scroll horizontally, hover a stage to trace the flow.</p>
    </div>
  );
}

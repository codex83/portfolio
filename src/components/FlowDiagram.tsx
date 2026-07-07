"use client";

import { useState } from "react";
import type { FlowStage } from "@/data/projects";

export default function FlowDiagram({ stages }: { stages: FlowStage[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        onMouseLeave={() => setActive(null)}
      >
        {stages.map((stage, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`rounded-lg border px-4 py-3 text-left transition-colors ${
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
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Stages run in numbered order — hover one to focus it.</p>
    </div>
  );
}

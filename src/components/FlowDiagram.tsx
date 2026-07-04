"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import type { FlowStage } from "@/data/projects";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 110;
const H_GAP = 90;

function StageNode({ data }: NodeProps<{ index: number; stage: FlowStage }>) {
  return (
    <div
      style={{ width: NODE_WIDTH }}
      className="rounded-lg border border-border bg-surface px-4 py-3 shadow-sm transition-colors hover:border-accent"
    >
      <Handle type="target" position={Position.Left} className="!bg-accent !border-0 !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-1.5">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
          {data.index + 1}
        </span>
        <span className="font-heading text-sm font-medium leading-tight text-foreground">
          {data.stage.label}
        </span>
      </div>
      <p className="text-xs leading-snug text-muted">{data.stage.description}</p>
      <Handle type="source" position={Position.Right} className="!bg-accent !border-0 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { stage: StageNode };

export default function FlowDiagram({ stages }: { stages: FlowStage[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const nodes: Node[] = useMemo(
    () =>
      stages.map((stage, i) => ({
        id: String(i),
        type: "stage",
        position: { x: i * (NODE_WIDTH + H_GAP), y: (i % 2) * 90 },
        data: { index: i, stage },
      })),
    [stages]
  );

  const edges: Edge[] = useMemo(
    () =>
      stages.slice(1).map((_, i) => ({
        id: `e${i}-${i + 1}`,
        source: String(i),
        target: String(i + 1),
        animated: selected === i || selected === i + 1,
        style: { stroke: "var(--border)", strokeWidth: 1.5 },
      })),
    [stages, selected]
  );

  return (
    <div className="w-full">
      <div
        className="h-[280px] w-full overflow-hidden rounded-xl border border-border bg-background md:h-[240px]"
        onMouseLeave={() => setSelected(null)}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll={false}
          onNodeMouseEnter={(_, node) => setSelected(Number(node.id))}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
        </ReactFlow>
      </div>
      <p className="mt-2 text-xs text-muted">Drag to pan, hover a stage to trace the flow.</p>
    </div>
  );
}

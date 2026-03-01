import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "reactflow";
import type { PrereqEdgeData } from "../types";

export default function PrereqEdge(props: EdgeProps<PrereqEdgeData>) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isHard = (data?.strength ?? "hard") === "hard";

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{
          strokeWidth: isHard ? 2.5 : 2,
          strokeDasharray: isHard ? undefined : "6 6",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            fontSize: 11,
            padding: "2px 6px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(0,0,0,0.08)",
            pointerEvents: "none",
          }}
        >
          {isHard ? "hard" : "soft"}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

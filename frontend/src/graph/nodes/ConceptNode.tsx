import { Handle, Position, type NodeProps } from "reactflow";
import type { ConceptNodeData } from "../types"

function statusStyle(status: ConceptNodeData["status"]) {
    switch (status) {
	case "mastered":
	    return { border: "2px solid #16a34a", background: "#ecfdf5", color: "#065f46" };
	case "unlocked":
	    return { border: "2px solid #2563eb", background: "#eff6ff", color: "#1e3a8a" };
	case "locked":
	default:
	    return { border: "2px dashed #9ca3af", background: "#f3f4f6", color: "#6b7280" };
    }
}

export default function ConceptNode({ data, selected }: NodeProps<ConceptNodeData>) {
    const styles = statusStyle(data.status);

    return (
	<div
	style={{
	    ...styles,
	    width: 220,
	    borderRadius: 12,
	    padding: 12,
	    boxShadow: selected ? "0 0 0 3px rgba(59,130,246,0.3)" : "0 1px 2px rgba(0,0,0,0.08)",
	    cursor: "pointer",
	    userSelect: "none",
	}}
	    >
	    {/* Incoming prereqs connect to left */}
	    <Handle type="target" position={Position.Left} style={{ borderRadius: 6 }} />
	    {/* Outgoing unlocks connect to right */}
	    <Handle type="source" position={Position.Right} style={{ borderRadius: 6 }} />

	    <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{data.title}</div>
	    <div style={{ marginTop: 6, fontSize: 12, opacity: 0.9 }}>
            {data.status.toUpperCase()}
	</div>
	    {data.description && (
		<div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>{data.description}</div>
	    )}
	</div>
    );
}

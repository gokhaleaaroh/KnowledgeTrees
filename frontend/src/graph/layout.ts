import dagre from "dagre";
import type { Edge, Node } from "reactflow";

export function layoutDAG<N, E>(
    nodes: Node<N>[],
    edges: Edge<E>[],
    direction: "LR" | "TB" = "LR"
) {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    g.setGraph({
	rankdir: direction, // LR = left-to-right, TB = top-to-bottom
	nodesep: 60,
	ranksep: 90,
    });

    // Must match your rendered node size reasonably
    const nodeWidth = 220;
    const nodeHeight = 110;

    nodes.forEach((n) => {
	g.setNode(n.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((e) => {
	g.setEdge(e.source, e.target);
    });

    dagre.layout(g);

    const laidOut = nodes.map((n) => {
	const pos = g.node(n.id);
	return {
	    ...n,
	    position: {
		x: pos.x - nodeWidth / 2,
		y: pos.y - nodeHeight / 2,
	    },
	    // Optional: prevent React Flow from trying to preserve old positions
	    // positionAbsolute: { ... } // not needed usually
	};
    });

    return { nodes: laidOut, edges };
}

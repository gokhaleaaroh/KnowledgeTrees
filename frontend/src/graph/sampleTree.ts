import type { Node, Edge } from "reactflow";
import type { ConceptNodeData, PrereqEdgeData } from "./types";

export const sampleNodes: Node<ConceptNodeData>[] = [
    {
	id: "calc_limits",
	type: "concept",
	position: { x: 0, y: 0 },
	data: {
	    title: "Limits",
	    description: "Understand the definition of limits, arithmetic laws, and get a geometric intuition for limits.",
	    status: "mastered",
	},
    },
    {
	id: "calc_derivatives",
	type: "concept",
	position: { x: 260, y: 0 },
	data: {
	    title: "Derivatives",
	    description: "Rates of change; differentiation rules.",
	    status: "unlocked",
	},
    },
    {
	id: "calc_integrals",
	type: "concept",
	position: { x: 520, y: 0 },
	data: {
	    title: "Integration (single-variable)",
	    description: "Antiderivatives, definite integrals, FTC.",
	    status: "locked",
	},
    },
    {
	id: "ode_separable",
	type: "concept",
	position: { x: 780, y: 0 },
	data: {
	    title: "Separable ODEs",
	    description: "Solve dy/dx = f(x)g(y) by separation.",
	    status: "locked",
	},
    },
];


export const sampleEdges: Edge<PrereqEdgeData>[] = [
    {
	id: "e1",
	source: "calc_limits",
	target: "calc_derivatives",
	type: "prereq",
	data: { strength: "hard" },
    },
    {
	id: "e2",
	source: "calc_derivatives",
	target: "calc_integrals",
	type: "prereq",
	data: { strength: "hard", rationale: "FTC links differentiation and integration." },
    },
    {
	id: "e3",
	source: "calc_integrals",
	target: "ode_separable",
	type: "prereq",
	data: { strength: "hard" },
    },
];

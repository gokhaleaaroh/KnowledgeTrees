import type { Edge, Node } from "reactflow";
import type { ConceptNodeData, PrereqEdgeData } from "./types";

type Id = string;

type Index = {
    nodesById: Map<Id, Node<ConceptNodeData>>;
    hardPrereqsOf: Map<Id, Set<Id>>;
    dependentsOf: Map<Id, Set<Id>>;
}

function isUnlocked(status: ConceptNodeData["status"]) {
    return status === "unlocked" || status === "mastered";
}

function buildIndex(
    nodes: Node<ConceptNodeData>[],
    edges: Edge<PrereqEdgeData>[]
): Index {
    const nodesById = new Map<Id, Node<ConceptNodeData>>();
    for (const n of nodes) nodesById.set(n.id, n);

    const hardPrereqsOf = new Map<Id, Set<Id>>();
    const depedentsOf = new Map<Id, Set<Id>>();

    const ensureSet = (m: Map<Id, Set<Id>>, k: Id) => {
	const s = m.get(k);
	if (s) return s;
	const ns = new Set<Id>();
	m.set(k, ns);
	return ns;
    };

    for (const e of edges) {
	const strength = e.data?.strength ?? "hard";

	if (strength === "hard") {
	    ensureSet(hardPrereqsOf, e.target).add(e.source);
	}

	ensureSet(dependentsOf, e.source).add(e.target);
    }

    for (const n of nodes) {
	if (!hardPrereqsOf.has(n.id)) hardPrereqsOf.set(n.id, new Set());
	if (!dependentsOf.has(n.id)) dependentsOf.set(n.id, new Set());
    }

    return { nodesById, hardPrereqsOf, dependentsOf };
}

function unlockedSet(nodes: Node<ConceptNodeData>[]) {
    const s = new Set<Id>();
    for (const n of nodes) if (isUnlocked(n.data.status)) s.add(n.id);

    return s;
}

function isReady(nodeId: Id, idx: Index, unlocked: Set<Id>) {
    const prereqs = idx.hardPrereqsOf.get(nodeId) ?? new Set<Id>();
    for (const p of prereqs) if (!unlocked.has(p)) return false;
    return true;
}

function prereqClosure(targetId: Id, idx: Index): Set<Id> {
    const visited = new Set<Id>();
    const stack: Id[] = [...(idx.hardPrereqsOf.get(targetId) ?? [])];

    while (stack.length) {
	const cur = stack.pop()!;
	if (visited.has(cur)) continue;
	visited.add(cur);
	for (const p of idx.hardPrereqsOf.get(cur) ?? []) stack.push(p);
    }

    return visited;
}

function prereqDistanceFromTarget(targetId: Id, idx: Index): Map<Id, number> {
    const dist = new Map<Id, number>();
    const q: Array<{id: Id, d: number }> = [];

    for (const p of idx.hardPrereqsOf.get(targetId) ?? []) {
	dist.set(p, 1);
	q.push({ id: p, d: 1});
    }

    while (q.length) {
	const { id, d } = q.shift()!;

	for (const p of idx.hardPrereqsOf.get(id) ?? []) {
	    const nd = d + 1;
	    const prev = dist.get(p)
	    if (prev === undefined || nd < prev) {
		dist.set(p, nd);
		q.push({ id: p, d: nd });
	    }
	}
    }

    return dist;
}

function globalImpact(candidateId: Id, idx: Index, nodes: Node<ConceptNodeData>[], unlocked: set<Id>) {
    let count = 0;

    for (const n of nodes) {
	if (isUnlocked(n.data.status)) continue;
	const prereqs = idx.hardPrereqsOf.get(n.id) ?? new Set<Id>();
	if (!prereqs.has(candidateId)) continue;

	let ok = true;
	for (const p of prereqs) {
	    if (p === candidateId) continue;
	    if (!unlocked.has(p)) {
		ok = false;
		break;
	    }
	}
	if (ok) count += 1;
    }
    
    return count;
}

export function recommendGlobalNext(
    nodes: Node<ConceptNodeData>[],
    edges: Edge<PrereqEdgeData>[],
    k: number
): Node<ConceptNodeData>[] {
    const idx = buildIndex(nodes, edges);
    const unlocked = unlockedSet(nodes);

    const candidates = nodes.filter(
	(n) => !isUnlocked(n.data.status) && isReady(n.id, idx, unlocked)
    );

    candidates.sort((a, b) => {
	const ia = globalImpact(a.id, idx, nodes, unlocked);
	const ib = globalImpact(b.id, idx, nodes, unlocked);
	if (ib !== ia) return ib - ia;

	const oa = (idx.dependentsOf.get(a.id)?.size ?? 0);
	const ob = (idx.dependentsOf.get(b.id)?.size ?? 0);

	if (ob !== oa) return ob - oa;
	
	return a.data.title.localCompare(b.data.title);
    });
}

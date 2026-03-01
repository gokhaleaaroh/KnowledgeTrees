export type ConceptStatus = "locked" | "unlocked" | "mastered";

export type ConceptNodeData = {
    title: string;
    description?: string;
    status: ConceptStatus
};

export type PrereqEdgeData {
    strength: "hard" | "soft";
    rationale?: string;
};

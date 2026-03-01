import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type EdgeChange,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import { layoutDAG } from "./layout";

import ConceptNode from "./nodes/ConceptNode";
import PrereqEdge from "./edges/PrereqEdge";
import type { ConceptNodeData, PrereqEdgeData, ConceptStatus } from "./types";
import { sampleEdges, sampleNodes } from "./sampleTree";

function uuid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function TreeEditor() {
  const [nodes, setNodes] = useState<Node<ConceptNodeData>[]>(sampleNodes);
  const [edges, setEdges] = useState<Edge<PrereqEdgeData>[]>(sampleEdges);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({ concept: ConceptNode }), []);
  const edgeTypes = useMemo(() => ({ prereq: PrereqEdge }), []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge<PrereqEdgeData> = {
        id: uuid("edge"),
        source: connection.source!,
        target: connection.target!,
        type: "prereq",
        data: { strength: "hard" },
        markerEnd: { type: MarkerType.ArrowClosed },
      };
  
      setEdges((eds) => {
        const nextEdges = addEdge(newEdge, eds);
        // after edges update, re-layout nodes against nextEdges
        setNodes((nds) => layoutDAG(nds, nextEdges, "LR").nodes);
        return nextEdges;
      });
    },
    []
  );

  const onNodeClick = useCallback((_evt: React.MouseEvent, node: Node<ConceptNodeData>) => {
    setSelectedNodeId(node.id);
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const updateSelectedNode = useCallback(
    (patch: Partial<ConceptNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? {
                ...n,
                data: { ...n.data, ...patch },
              }
            : n
        )
      );
    },
    [selectedNodeId]
  );

  const addConcept = useCallback(() => {
    const id = uuid("concept");
    const newNode: Node<ConceptNodeData> = {
      id,
      type: "concept",
      position: { x: 80, y: 80 },
      data: { title: "New Concept", description: "", status: "locked" },
    };
    setNodes((nds) => {
      const nextNodes = [...nds, newNode];
      const laid = layoutDAG(nextNodes, edges, "LR");
      return laid.nodes;
    });
    setSelectedNodeId(id);
  }, [edges]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", height: "80vh", gap: 12 }}>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 10, borderBottom: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
          <button onClick={addConcept}>+ Concept</button>
          <button onClick={deleteSelected} disabled={!selectedNodeId}>
            Delete selected
          </button>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
            Connect handles to add prereq edges.
          </span>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges.map((e) => ({
            ...e,
            markerEnd: e.markerEnd ?? { type: MarkerType.ArrowClosed },
          }))}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          nodesDraggable={false}
          nodesConnectable={true}   // keep connecting in editor mode
          elementsSelectable={true}
          panOnDrag={true}          // drag background to pan
          zoomOnScroll={true}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>

      <aside style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Node details</div>

        {!selectedNode && <div style={{ color: "#6b7280" }}>Click a node to edit it.</div>}

        {selectedNode && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Title</span>
              <input
                value={selectedNode.data.title}
                onChange={(e) => updateSelectedNode({ title: e.target.value })}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Description</span>
              <textarea
                rows={5}
                value={selectedNode.data.description ?? ""}
                onChange={(e) => updateSelectedNode({ description: e.target.value })}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Status</span>
              <select
                value={selectedNode.data.status}
                onChange={(e) => updateSelectedNode({ status: e.target.value as ConceptStatus })}
              >
                <option value="locked">locked</option>
                <option value="unlocked">unlocked</option>
                <option value="mastered">mastered</option>
              </select>
            </label>

            <div style={{ fontSize: 12, color: "#6b7280" }}>
              <div>
                <b>Id:</b> {selectedNode.id}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

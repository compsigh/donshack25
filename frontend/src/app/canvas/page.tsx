"use client"

import {
  addEdge,
  Background,
  BackgroundVariant,
  type Connection,
  ReactFlow,
  useEdgesState,
  useNodesState
} from "@xyflow/react"
import { useCallback } from "react"
import "@xyflow/react/dist/style.css"

const initialNodes = [
  { id: "cs112", position: { x: 0, y: 0 }, data: { label: "CS 112" } },
  { id: "cs110", position: { x: 0, y: 100 }, data: { label: "CS 110" } }
]
const initialEdges = [
  { id: "e1-2", source: "cs112", target: "cs110" }
]

export default function Canvas() {
  const [nodes,, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </>
  )
}

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
import { useCallback, useEffect } from "react"
import "@xyflow/react/dist/style.css"
import { getAllCourses } from "@/functions/db/course"

const initialNodes = [
  { id: "cs112", position: { x: 0, y: 0 }, data: { label: "CS 112" } },
  { id: "cs110", position: { x: 0, y: 100 }, data: { label: "CS 110" } }
]
const initialEdges = [{ id: "e1-2", source: "cs112", target: "cs110" }]

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const loadCourseData = async () => {
    const courses = await getAllCourses()

    const courseNodes = courses.map((course, index) => ({
      id: course.id.toString(),
      // Position nodes in a grid layout
      position: {
        x: (index % 3) * 250,
        y: Math.floor(index / 3) * 150
      },
      data: {
        label: course.title,
        subject: course.subject
      }
    }))

    // Create edges from prerequisite relationships
    // const courseEdges = courses.flatMap(course =>
    //   course.prerequisite.map(relatedCourse => ({
    //     id: `e${course.id}-${relatedCourse.id}`,
    //     source: course.id.toString(),
    //     target: relatedCourse.id.toString(),
    //     animated: true,
    //     style: { stroke: '#ff0072' }
    //   }))
    // );

    setNodes(courseNodes)
    setEdges([])
  }

  useEffect(() => {
    loadCourseData()
  }, [])

  return (
    <>
      <div style={{ width: "100vw", height: "100vh", color: "black" }}>
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

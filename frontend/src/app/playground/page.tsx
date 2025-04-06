"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Background,
  ReactFlow,
  addEdge,
  Panel,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  ReactFlowProvider
} from "@xyflow/react"
import dagre from "@dagrejs/dagre"
import "@xyflow/react/dist/style.css"
import { getAllCourses } from "@/functions/db/course"
import CourseFilters from "@/components/ui/courseFilter"
import { getAllSubjects } from "@/functions/db/subject"
import { Subject, Course } from "@prisma/client"

export default function App() {
  const [isMounted, setIsMounted] = useState(false)
  const [initialNodes, setInitialNodes] = useState<any[]>([])
  const [initialEdges, setInitialEdges] = useState<any[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  const [coursesTaken, setCoursesTaken] = useState<Course[]>([])

  const nodeWidth = 172
  const nodeHeight = 36

  const getLayoutedElements = (
    nodes: any[] | undefined,
    edges: any[] | undefined,
    direction = "TB"
  ) => {
    if (!nodes || !edges) {
      return
    }
    dagreGraph.setGraph({ rankdir: direction })

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      const newNode = {
        ...node,
        targetPosition: "top",
        sourcePosition: "bottom",
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2
        }
      }

      return newNode
    })

    return { nodes: newNodes, edges }
  }

  // Set initial state
  const layoutedElements = getLayoutedElements([], []) || {
    nodes: [],
    edges: []
  }
  const { nodes: layoutedNodes, edges: layoutedEdges } = layoutedElements

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  )

  const loadCourseData = async () => {
    const subjects = await getAllSubjects()
    setSubjects(subjects)

    const courses = await getAllCourses()

    const courseNodes = courses.map((course) => ({
      id: course.id.toString(),
      position: { x: 0, y: 0 },
      data: {
        label: course.name,
        description: course.description,
        credits: course.credits,
        subject: course.subject
      }
    }))

    // Create edges from prerequisite relationships
    // const courseEdges = courses.flatMap((course) =>
    //   course.prerequisites.map((relatedCourse) => ({
    //     id: `e${course.id}-${relatedCourse.id}`,
    //     source: course.id.toString(),
    //     target: relatedCourse.id.toString(),
    //     type: "smoothstep",
    //     animated: true,
    //     style: { stroke: "#ff0072" },
    //   }))
    // );

    const layout = getLayoutedElements(courseNodes, []) as any
    setNodes(layout.nodes)
    setEdges(layout.edges)
    setInitialNodes(layout.nodes)
    setInitialEdges(layout.edges)
  }

  const filterNodes = (nodes: any[]) => {
    if (selectedSubjects.length === 0) {
      return initialNodes
    }
    const resp = nodes.filter((node) => {
      const subjectMatch =
        selectedSubjects.filter(
          (subject) => subject.id === node.data.subject.id
        ).length > 0
      return subjectMatch
    })
    return resp
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
      return
    }
    const layout = getLayoutedElements(filterNodes(initialNodes), edges) as any
    if (!layout) {
      setNodes(initialNodes)
      setEdges(initialEdges)
      return
    }
    setNodes(layout.nodes)
    setEdges(layout.edges)
  }, [selectedSubjects])

  useEffect(() => {
    loadCourseData()
  }, [])

  useEffect(() => {
    // Create a new set of edges based on the current edges
    const newEdges = edges.map((edge) => ({
      ...edge,
      animated: true,
      style: { stroke: "#ff0072" } // Reset to default style
    }))

    if (!coursesTaken.length) {
      setEdges(newEdges)
      return
    }

    // Helper function to traverse the tree downwards and mark edges
    const traverseAndMarkEdges = (
      courseId: string,
      visited = new Set<string>()
    ) => {
      if (visited.has(courseId)) return
      visited.add(courseId)

      // Find all edges where this course is the target
      const incomingEdges = edges.filter((edge) => edge.source === courseId)

      incomingEdges.forEach((edge) => {
        // Update the edge style
        const edgeIndex = newEdges.findIndex((e) => e.id === edge.id)
        if (edgeIndex !== -1) {
          newEdges[edgeIndex] = {
            ...edge,
            animated: false,
            style: { stroke: "#22C55E", strokeWidth: 2 } // Green color for completed paths
          }
        }

        // Recursively traverse to the source of this edge
        traverseAndMarkEdges(edge.target, visited)
      })
    }

    // Process each taken course
    coursesTaken.forEach((course) => {
      const courseId = nodes.find((node) => node.data === course)?.id
      if (courseId) {
        traverseAndMarkEdges(courseId)
      }
    })

    // Update the edges state with the new styles
    setEdges(newEdges)
  }, [coursesTaken])

  return (
    <div className="w-full h-screen">
      <ReactFlowProvider>
        <Panel position="top-right">
          <CourseFilters
            courses={nodes.map((node) => node.data)}
            coursesTaken={coursesTaken}
            setCoursesTaken={setCoursesTaken}
            subjects={subjects}
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
          />
        </Panel>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          style={{ backgroundColor: "#F7F9FB" }}
        >
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

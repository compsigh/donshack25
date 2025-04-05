"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import { getAllCourses } from "@/functions/db/course";

export default function App() {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const [initialNodes, setInitialNodes] = useState();
  const [initialEdges, setInitialEdges] = useState();

  const nodeWidth = 172;
  const nodeHeight = 36;

  const getLayoutedElements = (
    nodes: any[] | undefined,
    edges: any[] | undefined,
    direction = "TB"
  ) => {
    if (!nodes || !edges) {
      return;
    }
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      const newNode = {
        ...node,
        targetPosition: "top",
        sourcePosition: "bottom",
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };

      return newNode;
    });

    return { nodes: newNodes, edges };
  };

  const layoutedElements = getLayoutedElements(initialNodes, initialEdges) || {
    nodes: [],
    edges: [],
  };
  const { nodes: layoutedNodes, edges: layoutedEdges } = layoutedElements;

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );

  const loadCourseData = async () => {
    const courses = await getAllCourses();

    const courseNodes = courses.map((course) => ({
      id: course.id.toString(),
      position: { x: 0, y: 0 },
      data: {
        label: course.name,
        description: course.description,
        credits: course.credits,
        subject: course.subject,
        professor: course.professor,
      },
    }));

    // Create edges from prerequisite relationships
    const courseEdges = courses.flatMap((course) =>
      course.prerequisite.map((relatedCourse) => ({
        id: `e${course.id}-${relatedCourse.id}`,
        source: course.id.toString(),
        target: relatedCourse.id.toString(),
        type: "smoothstep",
        animated: true,
        style: { stroke: "#ff0072" },
      }))
    );

    const layout = getLayoutedElements(courseNodes, courseEdges) as any;
    setNodes(layout.nodes);
    setEdges(layout.edges);
  };

  useEffect(() => {
    loadCourseData();
  }, []);

  return (
    <div className="w-full h-screen">
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
    </div>
  );
}

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
  ReactFlowProvider,
  MarkerType
} from "@xyflow/react"
import dagre from "@dagrejs/dagre"
import "@xyflow/react/dist/style.css"
import { getAllCourses } from "@/functions/db/course"
import CourseFilters from "@/components/ui/courseFilter"
import { getAllSubjects } from "@/functions/db/subject"
import { Subject, Course } from "@prisma/client"
import { recursiveQuery } from "@/functions/db/test"
import { randomUUID } from "crypto"

// Custom node types for AND/OR logic
const LogicNode = ({ data }: any) => {
  return (
    <div className={`px-4 py-2 rounded-md ${data.type === 'AND' ? 'bg-blue-500' : 'bg-orange-500'} text-white font-bold flex items-center justify-center`}>
      {data.type}
    </div>
  );
};

// Define node types
const nodeTypes = {
  logicNode: LogicNode,
};

// Interface for expression data
interface Expression {
  id: number;
  type: 'AND' | 'OR' | 'COURSE';
  courseId: string | null;
  parentId: number | null;
  course: Course | null;
  children: Expression[];
}

export default function App() {
  const [isMounted, setIsMounted] = useState(false)
  const [initialNodes, setInitialNodes] = useState<any[]>([])
  const [initialEdges, setInitialEdges] = useState<any[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  const [coursesTaken, setCoursesTaken] = useState<Course[]>([])
  const [prerequisites, setPrerequisites] = useState<Expression[]>([])

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

  // Helper function to process expression tree into nodes and edges
  const processExpressionTree = (expressions: Expression[]) => {
    const nodes: any[] = [];
    const edges: any[] = [];
    
    const processExpression = (expression: Expression) => {
      if (expression.type === 'COURSE' && expression.course) {
        // Add course node
        nodes.push({
          id: expression.id.toString(),
          position: { x: 0, y: 0 },
          data: {
            label: expression.course.title,
            subject: { code: expression.course.subjectCode },
            courseId: expression.courseId
          }
        });
      } else if (expression.type === 'AND' || expression.type === 'OR') {
        // Add logic node
        nodes.push({
          id: expression.id.toString(),
          position: { x: 0, y: 0 },
          type: 'logicNode',
          data: {
            type: expression.type
          }
        });
        
        // Process children
        expression.children.forEach(child => {
          processExpression(child);
          
          // Add edge from logic node to child
          const randomString = Math.random().toString(36).slice(2, 6);
          edges.push({
            id: randomString,
            source: expression.id.toString(),
            target: child.id.toString(),
            type: "smoothstep",
            animated: true,
            style: { stroke: "#757575" }
          });
        });
      }
    };
    
    // Process each expression
    expressions.forEach(expression => {
      processExpression(expression);
    });
    
    return { nodes, edges };
  };

  const loadCourseData = async () => {
    const subjects = await getAllSubjects();
    setSubjects(subjects);

    const courses = await getAllCourses();

    // Basic course nodes without prerequisites
    const courseNodes = courses.map((course) => ({
      id: course.id.toString(),
      position: { x: 0, y: 0 },
      data: {
        label: course.title,
        subject: { code: course.subjectCode },
        courseId: course.id
      }
    }));

    // Fetch prerequisite expressions from API
    try {
      const expressions = await recursiveQuery();
      const mappedExpressions: Expression[] = expressions.map((expression: any) => ({
        ...expression,
        course: expression.course || null,
        children: expression.children || [],
      }));
      
      setPrerequisites(mappedExpressions);
      
      // Process expressions into nodes and edges
      const { nodes: expressionNodes, edges: expressionEdges } = processExpressionTree(mappedExpressions);
      
      // Combine course nodes with expression nodes
      const allNodes = [...courseNodes, ...expressionNodes];
      
      // Add edges from courses to their prerequisite expressions
      const coursePrereqEdges = courses
        .filter(course => course.prerequisitesId)
        .map((course: any) => ({
          id: `e${course.id}-${course.prerequisitesId}`,
          source: course.prerequisitesId.toString(),
          target: course.id.toString(),
          type: "smoothstep",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#757575',
          },
          style: { stroke: "#757575" }
        }));
      
      const allEdges = [...expressionEdges, ...coursePrereqEdges];
      
      const layout = getLayoutedElements(allNodes, allEdges) as any;

      console.log("Layout nodes:", layout.nodes);
      console.log("Layout edges:", layout.edges);
      setNodes(layout.nodes);
      setEdges(layout.edges);
      setInitialNodes(layout.nodes);
      setInitialEdges(layout.edges);
    } catch (error) {
      console.error("Failed to fetch prerequisite expressions:", error);
      
      // Fallback to basic layout without prerequisites
      const layout = getLayoutedElements(courseNodes, []) as any;
      setNodes(layout.nodes);
      setEdges(layout.edges);
      setInitialNodes(layout.nodes);
      setInitialEdges(layout.edges);
    }
  };

  const filterNodes = (nodes: any[]) => {
    if (selectedSubjects.length === 0) {
      return initialNodes
    }
    
    // Get all logic nodes
    const logicNodes = nodes.filter(node => node.type === 'logicNode');
    
    // Get filtered course nodes
    const filteredCourseNodes = nodes.filter(node => {
      if (node.type === 'logicNode') return false;
      
      const subjectMatch =
        selectedSubjects.filter(
          (subject) => subject.code === node.data.subject.code
        ).length > 0;
      return subjectMatch;
    });
    
    // Return both logic nodes and filtered course nodes
    return [...logicNodes, ...filteredCourseNodes];
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

  // Helper function to check if a course meets the prerequisites based on courses taken
  const courseMeetsPrerequisites = (expressionId: number, coursesTaken: Course[]): any => {
    const expression = prerequisites.find(exp => exp.id === expressionId);
    if (!expression) return false;
    
    if (expression.type === 'COURSE') {
      return coursesTaken.some(course => course.id === expression.courseId);
    } else if (expression.type === 'AND') {
      return expression.children.every(child => 
        courseMeetsPrerequisites(child.id, coursesTaken)
      );
    } else if (expression.type === 'OR') {
      return expression.children.some(child => 
        courseMeetsPrerequisites(child.id, coursesTaken)
      );
    }
    
    return false;
  };

  useEffect(() => {
    // Create a new set of edges based on the current edges
    const newEdges = edges.map((edge) => ({
      ...edge,
      animated: true,
      style: { stroke: "#757575" } // Reset to default style
    }));

    if (!coursesTaken.length) {
      setEdges(newEdges);
      return;
    }

    // Mark edges for completed prerequisites
    edges.forEach((edge, index) => {
      const targetNode = nodes.find(node => node.id === edge.target);
      const sourceNode = nodes.find(node => node.id === edge.source);
      
      if (targetNode && sourceNode) {
        // If source is a course that has been taken
        if (!sourceNode.type && coursesTaken.some(course => course.id === sourceNode.data.courseId)) {
          newEdges[index] = {
            ...edge,
            animated: false,
            style: { stroke: "#22C55E", strokeWidth: 2 }
          };
        }
        
        // If source is a logic node (AND/OR)
        if (sourceNode.type === 'logicNode') {
          const expressionId = parseInt(sourceNode.id);
          if (courseMeetsPrerequisites(expressionId, coursesTaken)) {
            newEdges[index] = {
              ...edge,
              animated: false,
              style: { stroke: "#22C55E", strokeWidth: 2 }
            };
          }
        }
      }
    });

    // Update the edges state with the new styles
    setEdges(newEdges);
  }, [coursesTaken, nodes]);

  return (
    <div className="w-full h-screen">
      <ReactFlowProvider>
        <Panel position="top-right">
          <CourseFilters
            courses={nodes
              .filter(node => !node.type) // Filter out logic nodes
              .map((node) => node.data)}
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
          nodeTypes={nodeTypes}
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
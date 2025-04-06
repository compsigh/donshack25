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

interface LogicNodeProps {
    data: {
        type: 'AND' | 'OR';
        courses: Course[];
    }
}

// Custom node types for AND/OR logic
const LogicNode = ({ data }: LogicNodeProps) => {
    const { type, courses } = data;
    // Determine styling based on node type
    const headerBgColor = type === 'AND' ? 'bg-blue-600' : 'bg-orange-600';
    const bodyBgColor = type === 'AND' ? 'bg-blue-100' : 'bg-orange-100';
    const borderColor = type === 'AND' ? 'border-blue-600' : 'border-orange-600';
    
    return (
      <div className={`rounded-md shadow-md overflow-hidden border-2 ${borderColor} w-64`}>
        {/* Header with node type */}
        <div className={`${headerBgColor} text-white font-bold py-2 px-4 text-center`}>
          {type === 'AND' ? 'All Required' : 'Any One Required'}
        </div>
        
        {/* Courses list */}
        <div className={`${bodyBgColor} p-2`}>
          {courses.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {courses.map((course) => (
                <li key={course.id} className="py-2 px-1 flex items-center">
                  <span className="font-medium text-gray-800">{course.id}</span>
                  <span className="ml-2 text-sm text-gray-600">{course.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No courses specified</p>
          )}
        </div>
        
        {/* Footer with course count */}
        <div className={`${headerBgColor} bg-opacity-80 text-white text-xs py-1 px-4 text-center`}>
          {courses.length} course{courses.length !== 1 ? 's' : ''}
        </div>
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
        // Use larger dimensions for logic nodes
        const isLogicNode = node.type === 'logicNode';
        const width = isLogicNode ? 256 : nodeWidth; // 256px for logic nodes
        const height = isLogicNode ? 150 : nodeHeight; // 150px for logic nodes
        
        dagreGraph.setNode(node.id, { width, height });
      });

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
        // Get all child courses
        const childCourses = expression.children
            .filter(child => child.type === 'COURSE' && child.course)
            .map(child => ({
            id: child.courseId!,
            title: child.course!.title
            }));
        
        if (!childCourses.length) {
            return;
        }

        // Add logic node with courses
        nodes.push({
            id: expression.id.toString(),
            position: { x: 0, y: 0 },
            type: 'logicNode',
            data: {
            type: expression.type,
            courses: childCourses
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

        console.log('node: ', node);
        console.log('logicNodes: ', logicNodes);

        const courseId = node.data.courseId;
        const courseIdMatch = logicNodes.some((node) => node.data.courses.some((course: any) => course.id === courseId));
    
      return subjectMatch && !courseIdMatch
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
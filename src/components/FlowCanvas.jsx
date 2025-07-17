import { useCallback, useMemo, useEffect } from "react"
import ReactFlow, { ReactFlowProvider, addEdge, MiniMap, Controls, Background, useReactFlow, applyNodeChanges, applyEdgeChanges, BackgroundVariant, MarkerType } 
from "reactflow"
import "reactflow/dist/style.css"
import { useTheme } from "next-themes"

import TextNode from "./CustomNodes/TextNode"
import ConditionNode from "./CustomNodes/ConditionNode"
import CustomNode from "./CustomNodes/CustomNode"

// Map node types to their custom components
const nodeTypes = {
  textNode: TextNode,
  conditionNode: ConditionNode,
  customNode: CustomNode,
}

function FlowCanvasInner({
  onNodeSelect,
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  isDesktop, 
}) {
  const reactFlowInstance = useReactFlow()
  const { theme } = useTheme()

  // Handles node changes either by forwarding event or updating state internally
  const handleNodesChange = useCallback(
    (changes) => {
      if (onNodesChange) {
        onNodesChange(changes)
      } else {
        setNodes((nds) => applyNodeChanges(changes, nds))
      }
    },
    [onNodesChange, setNodes],
  )

  // Handles edge changes similarly, supporting external handler or internal update
  const handleEdgesChange = useCallback(
    (changes) => {
      if (onEdgesChange) {
        onEdgesChange(changes)
      } else {
        setEdges((eds) => applyEdgeChanges(changes, eds))
      }
    },
    [onEdgesChange, setEdges],
  )

  // Customize edge creation to support conditional nodes with labeled edges ("true" or "false")
  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((n) => n.id === params.source)
      let edgeLabel = ""

      if (sourceNode?.type === "conditionNode") {
        // Assign "true" label to first edge, "false" to second
        const existingEdges = edges.filter((e) => e.source === sourceNode.id)
        edgeLabel = existingEdges.length === 0 ? "true" : "false"
      }

      // Build edge with styling and marker depending on theme
      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        data: { label: edgeLabel },
        sourceHandle: edgeLabel, // Label used for handle identification
        style: {
          stroke: theme === "dark" ? "#64748b" : "#475569",
          strokeWidth: 2,
        },
        labelStyle: {
          fill: theme === "dark" ? "#f1f5f9" : "#1e293b",
          fontWeight: 500,
          fontSize: 12,
        },
        labelBgStyle: {
          fill: theme === "dark" ? "#1e293b" : "#ffffff",
          fillOpacity: 0.9,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: theme === "dark" ? "#64748b" : "#475569",
        },
      }

      setEdges((eds) => addEdge(newEdge, eds))
    },
    [nodes, edges, setEdges, theme],
  )

  // Allow dragover for drag-and-drop with visual feedback
  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Handle dropping a new node on canvas, create node with default data based on type
  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")
      if (typeof type === "undefined" || !type) {
        return
      }

      // Convert screen coords to React Flow coords
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      let nodeData
      switch (type) {
        case "textNode":
          nodeData = { label: "New Message", messageType: "sms" } // Default message type for TextNode
          break
        case "conditionNode":
          nodeData = {
            label: "New Condition",
            condition: "true",
          }
          break
        case "customNode":
          nodeData = {
            label: "Enter your custom message...",
            messageType: "system",
          }
          break
        default:
          nodeData = { label: "New Message", messageType: "sms" }
      }

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  // Notify parent about node selection on click or double-click
  const onNodeClick = useCallback(
    (_, node) => {
      onNodeSelect?.(node)
    },
    [onNodeSelect],
  )

  const onNodeDoubleClick = useCallback(
    (_, node) => {
      onNodeSelect?.(node)
    },
    [onNodeSelect],
  )

  // Clear selection when clicking on the canvas background
  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null)
  }, [onNodeSelect])

  // Memoize the minimap node color function
  const minimapNodeColor = useMemo(
    () => (node) => {
      switch (node.type) {
        case "textNode":
          return theme === "dark" ? "#3b82f6" : "#2563eb"
        case "conditionNode":
          return theme === "dark" ? "#eab308" : "#ca8a04"
        case "customNode":
          return theme === "dark" ? "#8b5cf6" : "#7c3aed"
        default:
          return theme === "dark" ? "#64748b" : "#475569"
      }
    },
    [theme],
  )

  // Fit view when nodes are added or removed
  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      reactFlowInstance.fitView({
        padding: 0.2,
        duration: 300,
        maxZoom: 0.9,
      })
    }
  }, [nodes.length, reactFlowInstance])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        onDragOver={isDesktop ? onDragOver : undefined} 
        onDrop={isDesktop ? onDrop : undefined}         
        fitView
        fitViewOptions={{ maxZoom: 0.9, minZoom: 0.2 }}  
        className="bg-background"
        panOnDrag={true}
        defaultEdgeOptions={{
          style: {
            stroke: theme === "dark" ? "#64748b" : "#475569",
            strokeWidth: 2,
          },
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: theme === "dark" ? "#64748b" : "#475569",
          },
        }}
      >
        {/* Background grid pattern */}
        <Background
          color={theme === "dark" ? "#374151" : "#e2e8f0"}
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
        />
        {/* Zoom, pan controls with themed styling */}
        <Controls
          className="bg-background border border-border rounded-lg shadow-lg"
          style={{
            button: {
              backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
              color: theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
              border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
            },
          }}
        />
        {/* Minimap showing node colors based on type */}
        <MiniMap
          nodeColor={minimapNodeColor}
          className="bg-background border border-border rounded-lg shadow-lg"
          style={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          }}
          maskColor={theme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"}
        />
      </ReactFlow>
    </div>
  )
}

// Provider wrapper to supply ReactFlow context to FlowCanvasInner
export default function FlowCanvas({
  onNodeSelect,
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  isDesktop, 
}) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner
        onNodeSelect={onNodeSelect}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        isDesktop={isDesktop} 
      />
    </ReactFlowProvider>
  )
}

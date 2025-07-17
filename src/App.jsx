import { useCallback, useEffect, useState } from "react"
import FlowCanvas from "../src/components/FlowCanvas"
import Sidebar from "../src/components/Sidebar"
import SaveButton from "../src/components/SaveButton"
import ExportButton from "../src/components/ExportButton"
import SimulationPanel from "../src/components/SimulationPanel"
import { applyNodeChanges, applyEdgeChanges } from "reactflow"
import { Button } from "./components/ui/button"
import { Play, Save, Download, PanelLeft } from "lucide-react"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet"
import { useMediaQuery } from "./hooks/use-media-query"
import MobileWarningToast from "./components/MobileWarningToast"

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null)

  const [nodes, setNodes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatbot-flow-nodes")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [edges, setEdges] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatbot-flow-edges")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [isSimulating, setIsSimulating] = useState(false)
  const { theme, setTheme } = useTheme()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const updateNodeData = (id, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    )
  }

  const handleNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const handleEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const timeout = setTimeout(() => {
      localStorage.setItem("chatbot-flow-nodes", JSON.stringify(nodes))
      localStorage.setItem("chatbot-flow-edges", JSON.stringify(edges))
      console.log("Auto-saving flow")
    }, 500)
    return () => clearTimeout(timeout)
  }, [nodes, edges])

  const addNodeToCanvas = useCallback(
    (nodeType) => {
      let nodeData
      switch (nodeType) {
        case "textNode":
          nodeData = { label: "New Message", messageType: "sms" }
          break
        case "conditionNode":
          nodeData = { label: "New Condition", condition: "true" }
          break
        case "customNode":
          nodeData = { label: "Enter your custom message...", messageType: "system" }
          break
        default:
          nodeData = { label: "New Message", messageType: "sms" }
      }

      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position: { x: 0, y: 0 },
        data: nodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  const handleContinueAndOpenSidebar = useCallback(() => {
    setIsSheetOpen(true)
  }, [])

  if (isSimulating) {
    return (
      <div className="h-screen w-screen bg-background">
        <SimulationPanel nodes={nodes} edges={edges} onExit={() => setIsSimulating(false)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar */}
      {isDesktop && (
        <div className="w-80 h-full overflow-hidden flex-shrink-0 border-r border-border">
          <Sidebar
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            onDeselect={() => setSelectedNode(null)}
            onNodeSelect={setSelectedNode}
            onNodeTap={addNodeToCanvas}
          />
        </div>
      )}

      {/* Flow Canvas */}
      <div className="flex-1 relative bg-muted/30 h-full">
        <FlowCanvas
          onNodeSelect={setSelectedNode}
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          isDesktop={isDesktop}
        />

        {/* Action buttons */}
        <div className="absolute top-4 inset-x-4 flex flex-wrap justify-end items-center gap-2 z-10">
          {!isDesktop && (
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Open sidebar">
                  <PanelLeft className="h-4 w-4 mr-1" />
                  <span>Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 sm:w-96">
                <Sidebar
                  selectedNode={selectedNode}
                  updateNodeData={updateNodeData}
                  onDeselect={() => setSelectedNode(null)}
                  onNodeSelect={setSelectedNode}
                  onNodeTap={addNodeToCanvas}
                />
              </SheetContent>
            </Sheet>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </Button>

          <SaveButton nodes={nodes} edges={edges}>
            <Button size="sm" variant="outline">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </SaveButton>

          <ExportButton nodes={nodes} edges={edges}>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </ExportButton>

          <Button onClick={() => setIsSimulating(true)} size="sm" variant="default">
            <Play className="h-4 w-4 mr-1" />
            Simulate
          </Button>
        </div>
      </div>

      {!isDesktop && (
        <MobileWarningToast onContinueAndOpenSidebar={handleContinueAndOpenSidebar} />
      )}
    </div>
  )
}

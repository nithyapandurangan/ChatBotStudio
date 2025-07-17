import { useCallback, useEffect, useState } from "react"
import FlowCanvas from "../src/components/FlowCanvas"
import Sidebar from "../src/components/Sidebar"
import SaveButton from "../src/components/SaveButton"
import ExportButton from "../src/components/ExportButton"
import SimulationPanel from "../src/components/SimulationPanel"
import { applyNodeChanges, applyEdgeChanges } from "reactflow"
import { Button } from "./components/ui/button"
import { Play, Save, Download } from "lucide-react"
import { useTheme } from "next-themes"

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

  const updateNodeData = (id, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...newData } } : node)),
    )
  }

  const handleNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  const handleEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))
  }, [])

  // Auto-save logic
  useEffect(() => {
    if (typeof window === "undefined") return

    const timeout = setTimeout(() => {
      localStorage.setItem("chatbot-flow-nodes", JSON.stringify(nodes))
      localStorage.setItem("chatbot-flow-edges", JSON.stringify(edges))
      console.log("Auto-saving flow")
    }, 500)

    return () => clearTimeout(timeout)
  }, [nodes, edges])

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
      <div className="md:w-80 w-full h-auto md:h-full overflow-hidden flex-shrink-0 border-b md:border-b-0 md:border-r border-border">
        <Sidebar
          selectedNode={selectedNode}
          updateNodeData={updateNodeData}
          onDeselect={() => setSelectedNode(null)}
          onNodeSelect={setSelectedNode}
        />
      </div>

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
        />

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
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
    </div>
  )
}

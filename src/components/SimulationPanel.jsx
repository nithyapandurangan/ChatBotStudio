import { useEffect, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { useToast } from "../hooks/use-toast"
import { Play, Square, RotateCcw, X, MessageSquare, GitBranch, Settings, AlertTriangle } from "lucide-react"

const MAX_SIMULATION_STEPS = 100 // limit to prevent infinite loops in the flow

// Simple markdown-like renderer 
function renderMarkdown(text) {
  if (!text) return ""
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>') // bold: **text**
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>') // italic: *text*
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>') // inline code: `text`
    .replace(/\n/g, "<br>") // newline to <br>
}

export default function SimulationPanel({ nodes, edges, onExit }) {
  const [messages, setMessages] = useState([])
  const [currentNode, setCurrentNode] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stepCount, setStepCount] = useState(0)
  const [simulationSpeed, setSimulationSpeed] = useState(1500)
  const { toast } = useToast()

  // Finds the start node: a node with no incoming edges (no edge's target is this node)
  const findStartNode = useCallback(() => {
    const targets = new Set(edges.map((edge) => edge.target))
    return nodes.find((node) => !targets.has(node.id)) || null
  }, [nodes, edges])

  // Given a node, determine the next node in the flow based on edges and conditions
  const getNextNode = useCallback(
    (node) => {
      if (!node) return null

      if (node.type === "conditionNode") {
        // Evaluate the condition safely (try/catch)
        let result = false
        try {
          const condition = node.data.condition || "true"
          result = new Function("return " + condition)()
        } catch (error) {
          // Show error toast if condition code throws
          const errorMsg = `Invalid condition in node: ${error instanceof Error ? error.message : "Unknown error"}`
          toast({
            title: "Condition Error",
            description: errorMsg,
            variant: "destructive",
          })
          return null
        }

        const resultStr = result.toString().toLowerCase()
        // Find edge whose label or sourceHandle matches the condition result ("true" or "false")
        const sourceEdges = edges.filter((e) => e.source === node.id)
        const targetEdge = sourceEdges.find((e) => {
          const labelMatch = e.data?.label?.toLowerCase() === resultStr
          const handleMatch = e.sourceHandle?.toLowerCase() === resultStr
          return labelMatch || handleMatch
        })

        if (!targetEdge) {
          // No matching edge for condition result -> show error toast
          toast({
            title: "Flow Error",
            description: `No edge found for condition result: ${result}`,
            variant: "destructive",
          })
          return null
        }

        // Return node that edge points to
        return nodes.find((n) => n.id === targetEdge.target) || null
      } else {
        // For non-condition nodes, just pick the first outgoing edge and return its target node
        const targetEdge = edges.find((e) => e.source === node.id)
        if (!targetEdge) return null
        return nodes.find((n) => n.id === targetEdge.target) || null
      }
    },
    [nodes, edges, toast],
  )

  // Add a message object to the conversation log based on node type
  const addMessage = useCallback((node) => {
    const messageId = `${node.id}-${Date.now()}`
    let message

    if (node.type === "conditionNode") {
      // For condition node, show the condition evaluated
      message = {
        id: messageId,
        type: "condition",
        content: `Evaluating condition: ${node.data.condition || "true"}`,
        nodeId: node.id,
        nodeType: node.type,
        timestamp: new Date(),
      }
    } else if (node.type === "customNode" && node.data.messageType === "markdown") {
      // For custom nodes with markdown message type, mark content as markdown for rendering
      message = {
        id: messageId,
        type: "message",
        content: node.data.label || "",
        nodeId: node.id,
        nodeType: node.type,
        timestamp: new Date(),
        isMarkdown: true,
      }
    } else {
      // Default message for other nodes
      message = {
        id: messageId,
        type: "message",
        content: node.data.label || "",
        nodeId: node.id,
        nodeType: node.type,
        timestamp: new Date(),
      }
    }

    setMessages((prev) => [...prev, message])
  }, [])

  // Initialize and start the simulation from the start node
  const startSimulation = useCallback(() => {
    const start = findStartNode()
    if (!start) {
      toast({
        title: "Simulation Error",
        description: "No valid start node found. Cannot simulate.",
        variant: "destructive",
      })
      return
    }

    // Reset messages and state for new simulation run
    setMessages([])
    setCurrentNode(start)
    setIsPlaying(true)
    setStepCount(0)
  }, [findStartNode, toast])

  // Pause the simulation
  const stopSimulation = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // Reset simulation state fully
  const resetSimulation = useCallback(() => {
    setMessages([])
    setStepCount(0)
    setIsPlaying(false)
    setCurrentNode(null)
  }, [])

  // Auto-start simulation on component mount
  useEffect(() => {
    startSimulation()
  }, [startSimulation])

  // Main simulation loop, runs on changes to current node, playing state, step count, etc.
  useEffect(() => {
    if (!isPlaying || !currentNode) return

    // Safety: stop simulation if steps exceed limit to avoid infinite loops
    if (stepCount >= MAX_SIMULATION_STEPS) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: "error",
        content: "Simulation stopped after 100 steps to prevent infinite loop.",
        nodeId: "system",
        nodeType: "system",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsPlaying(false)
      return
    }

    // Schedule next step after delay defined by simulationSpeed
    const timeout = setTimeout(() => {
      addMessage(currentNode)

      // Determine next node and advance
      const next = getNextNode(currentNode)
      if (next) {
        setCurrentNode(next)
        setStepCount((prev) => prev + 1)
      } else {
        // No next node = end of flow
        setIsPlaying(false)
        toast({
          title: "Simulation Complete",
          description: "The flow has reached its end.",
        })
      }
    }, simulationSpeed)

    // Cleanup timeout on dependencies change or unmount
    return () => clearTimeout(timeout)
  }, [currentNode, isPlaying, stepCount, simulationSpeed, addMessage, getNextNode, toast])

  // Determine icon for each message type for UI display
  const getMessageIcon = (message) => {
    switch (message.type) {
      case "condition":
        return <GitBranch className="h-4 w-4 text-yellow-600" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />
    }
  }

  // Determine background and border styles for message types
  const getMessageStyle = (message) => {
    switch (message.type) {
      case "condition":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "system":
        return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header bar showing simulation title, step count, status badge, and exit button */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Flow Simulation</h1>
            <p className="text-sm text-muted-foreground">
              Step {stepCount} of {MAX_SIMULATION_STEPS} • {messages.length} messages
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Badge indicates whether simulation is running or stopped */}
            <Badge variant={isPlaying ? "default" : "secondary"}>{isPlaying ? "Running" : "Stopped"}</Badge>
            {/* Button to exit simulation mode */}
            <Button variant="outline" size="sm" onClick={onExit}>
              <X className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Main messages display area with scrollable conversation */}
      <div className="flex-1 p-4">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversation Flow</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-280px)] px-6">
              <div className="space-y-4 pb-4">
                {/* Show placeholder if no messages yet */}
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Simulation will start automatically...</p>
                    </div>
                  </div>
                ) : (
                  // Map over messages and render each with appropriate style and icon
                  messages.map((message) => (
                    <div key={message.id} className={`p-4 rounded-lg border ${getMessageStyle(message)}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getMessageIcon(message)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {/* Badge showing node type */}
                            <Badge variant="outline" className="text-xs">
                              {message.nodeType}
                            </Badge>
                            {/* Timestamp of message */}
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            {/* Render markdown if message flagged as markdown */}
                            {message.isMarkdown ? (
                              <div
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                              />
                            ) : (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Control panel with start/stop, reset, and speed selection */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Start or Stop button toggles simulation state */}
            <Button onClick={isPlaying ? stopSimulation : startSimulation} size="sm">
              {isPlaying ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            {/* Reset button resets simulation */}
            <Button onClick={resetSimulation} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Speed selector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <select
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className="text-sm border border-input bg-background px-2 py-1 rounded"
            >
              <option value={500}>Fast (0.5s)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={1500}>Slow (1.5s)</option>
              <option value={2500}>Very Slow (2.5s)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

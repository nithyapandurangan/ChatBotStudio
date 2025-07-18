import { useEffect, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { useToast } from "../hooks/use-toast"
import { Play, Square, X, MessageSquare, GitBranch, Settings, AlertTriangle } from "lucide-react"

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
  const [simulationInput, setSimulationInput] = useState("") // Store user input for conditions
  const [conversationHistory, setConversationHistory] = useState([]) // Store conversation for context
  const [showTestInput, setShowTestInput] = useState(false)
  
  // Add these new states to track when waiting for input
  const [waitingForInput, setWaitingForInput] = useState(false)
  const [inputPrompt, setInputPrompt] = useState("")
  const [inputProvided, setInputProvided] = useState(false) // Track if input has been provided for this condition

  const { toast } = useToast()

  // Finds the start node: a node with no incoming edges (no edge's target is this node)
  const findStartNode = useCallback(() => {
    const targets = new Set(edges.map((edge) => edge.target))
    return nodes.find((node) => !targets.has(node.id)) || null
  }, [nodes, edges])

  // Given a node, determine the next node in the flow based on edges and conditions
  const getNextNode = useCallback(
    (node, userInput = "") => {
      if (!node) return null

      if (node.type === "conditionNode") {
        // Evaluate the condition safely with proper context
        let result = false
        try {
          const condition = node.data.condition || "true"
          
          // Create a context for condition evaluation
          const context = {
            input: userInput || simulationInput,
            conversationHistory,
            messages: conversationHistory,
            // Add more context variables as needed
          }
          
          // Create a function with the context variables available
          const conditionFunction = new Function(
            'input', 'conversationHistory', 'messages',
            `return ${condition}`
          )
          
          result = conditionFunction(context.input, context.conversationHistory, context.messages)
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

        const resultStr = result ? "true" : "false"
        
        // Find edge whose label or sourceHandle matches the condition result
        const sourceEdges = edges.filter((e) => e.source === node.id)
        const targetEdge = sourceEdges.find((e) => {
          const labelMatch = e.label?.toLowerCase() === resultStr
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

        // Add condition result to messages for debugging
        const conditionMessage = {
          id: `condition-result-${Date.now()}`,
          type: "condition",
          content: `Condition result: ${result} (${resultStr})`,
          nodeId: node.id,
          nodeType: "conditionResult",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, conditionMessage])

        // Return node that edge points to
        return nodes.find((n) => n.id === targetEdge.target) || null
      } else {
        // For non-condition nodes, just pick the first outgoing edge and return its target node
        const targetEdge = edges.find((e) => e.source === node.id)
        if (!targetEdge) return null
        return nodes.find((n) => n.id === targetEdge.target) || null
      }
    },
    [nodes, edges, toast, simulationInput, conversationHistory],
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
    
    // Add to conversation history for context
    setConversationHistory((prev) => [...prev, {
      content: message.content,
      type: message.type,
      nodeType: message.nodeType,
      timestamp: message.timestamp
    }])
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
    setConversationHistory([])
    setCurrentNode(start)
    setIsPlaying(true)
    setStepCount(0)
    setWaitingForInput(false)
    setInputPrompt("")
    setInputProvided(false)
  }, [findStartNode, toast])

  // Pause the simulation
  const stopSimulation = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // Add a function to resume simulation with input (including empty input)
  const resumeWithInput = useCallback(() => {
    setWaitingForInput(false)
    setInputPrompt("")
    setInputProvided(true) // Mark that input has been provided
    setIsPlaying(true)
  }, [])

  // Add a function to resume with explicitly no input
  const resumeWithNoInput = useCallback(() => {
    setSimulationInput("")
    setWaitingForInput(false)
    setInputPrompt("")
    setInputProvided(true) // Mark that input has been provided
    setIsPlaying(true)
  }, [])

  // Auto-start simulation on component mount
  useEffect(() => {
    startSimulation()
  }, [startSimulation])

  // Main simulation loop, runs on changes to current node, playing state, step count, etc.
  useEffect(() => {
    if (!isPlaying || !currentNode || waitingForInput) return

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

      // Handle condition nodes specially
      if (currentNode.type === "conditionNode") {
        // Only pause if we haven't provided input for this condition yet
        if (!inputProvided) {
          setWaitingForInput(true)
          setInputPrompt(`Please provide input to test the condition: "${currentNode.data.condition}"`)
          setIsPlaying(false)
          
          const waitingMessage = {
            id: `waiting-${Date.now()}`,
            type: "system",
            content: `⏸️ Simulation paused. This condition needs input to evaluate: "${currentNode.data.condition}"`,
            nodeId: currentNode.id,
            nodeType: "system",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, waitingMessage])
          return
        }
      }

      // Use actual input (not fake)
      const testInput = simulationInput
      const next = getNextNode(currentNode, testInput)
      
      if (next) {
        setCurrentNode(next)
        setStepCount((prev) => prev + 1)
        // Reset inputProvided when moving to next node
        setInputProvided(false)
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
  }, [currentNode, isPlaying, stepCount, simulationSpeed, addMessage, getNextNode, toast, simulationInput, waitingForInput])

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
            <Badge variant={isPlaying ? "default" : waitingForInput ? "destructive" : "secondary"}>
              {isPlaying ? "Running" : waitingForInput ? "Waiting for Input" : "Stopped"}
            </Badge>
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

      {/* Control panel with start/stop, speed selection, and test input */}
      <div className="border-t border-border p-4">
        <div className="flex flex-col gap-3">
          
          {/* Show input prompt when waiting for input */}
          {waitingForInput && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 dark:bg-yellow-900/20 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">{inputPrompt}</p>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={simulationInput}
                  onChange={(e) => setSimulationInput(e.target.value)}
                  placeholder="Enter test input (or leave empty for no input)"
                  className="flex-1 text-sm border border-input bg-background px-3 py-2 rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={resumeWithInput} size="sm" variant="default">
                  Resume with Input
                </Button>
                <Button onClick={resumeWithNoInput} size="sm" variant="outline">
                  Resume with No Input
                </Button>
              </div>
            </div>
          )}

          {/* Toggle for advanced testing */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-test-input"
              checked={showTestInput}
              onChange={(e) => setShowTestInput(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="show-test-input" className="text-sm text-muted-foreground">
              Show test input (for condition testing)
            </label>
          </div>

          {/* Conditionally show test input field */}
          {showTestInput && (
            <div className="flex items-center gap-2">
              <label htmlFor="test-input" className="text-sm text-muted-foreground min-w-fit">
                Test Input:
              </label>
              <input
                id="test-input"
                type="text"
                value={simulationInput}
                onChange={(e) => setSimulationInput(e.target.value)}
                placeholder="Enter test input for conditions (e.g., 'I need help with a product')"
                className="flex-1 text-sm border border-input bg-background px-3 py-2 rounded"
              />
            </div>
          )}
        
          {/* Control buttons and speed selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Start or Stop button toggles simulation state */}
              <Button 
                onClick={isPlaying ? stopSimulation : startSimulation} 
                size="sm"
                disabled={waitingForInput}
              >
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
    </div>
  )
}

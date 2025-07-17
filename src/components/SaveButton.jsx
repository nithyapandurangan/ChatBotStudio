import { useState } from "react"
import { Button } from "./ui/button"
import { useToast } from "../hooks/use-toast"
import { Save, Check } from "lucide-react"

export default function SaveButton({ nodes, edges, children }) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const { toast } = useToast()

  const validateFlow = () => {
    // Case 1: No nodes at all
    if (nodes.length === 0) {
      return { isValid: false, message: "Flow is empty. Please add some nodes." }
    }

    // Case 2: Single node — always valid (no edges required)
    if (nodes.length === 1) {
      return { isValid: true }
    }

    // Case 3: Multiple nodes but no edges
    if (edges.length === 0) {
      return { isValid: false, message: "Multiple nodes exist but none are connected." }
    }

    // Case 4: Find nodes with no incoming edges (potential start nodes)
    const targets = new Set(edges.map((edge) => edge.target))
    const startNodes = nodes.filter((node) => !targets.has(node.id))

    // Case 4.1: No start node found — flow has cycles or bad structure
    if (startNodes.length === 0) {
      return { isValid: false, message: "No start node found (all nodes have incoming edges)." }
    }

    // Case 4.2: More than one start node — ambiguous entry point
    if (startNodes.length > 1) {
      return { isValid: false, message: "Multiple start nodes found. Flow should have only one starting point." }
    }

    // Case 5: BFS traversal from start node to detect disconnected components
    const startNodeId = startNodes[0].id
    const visited = new Set()
    const queue = [startNodeId]

    while (queue.length > 0) {
      const current = queue.shift()
      visited.add(current)

      edges.forEach((edge) => {
        if (edge.source === current && !visited.has(edge.target)) {
          queue.push(edge.target)
        }
      })
    }

    // Case 6: Not all nodes were visited — flow has disconnected pieces
    if (visited.size !== nodes.length) {
      return { isValid: false, message: "Flow contains disconnected nodes. All nodes must be connected." }
    }

    // Case 7: All validations passed
    return { isValid: true }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const validation = validateFlow()

      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.message,
          variant: "destructive",
        })
        return
      }

      const flow = { nodes, edges, timestamp: new Date().toISOString() }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Persist to localStorage
      localStorage.setItem("chatbot-flow-backup", JSON.stringify(flow))

      setLastSaved(new Date())
      toast({
        title: "Flow Saved",
        description: "Your chatbot flow has been saved successfully.",
      })

      console.log("Flow Saved:", flow)
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save the flow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (children) {
    return (
      <div onClick={handleSave} className="cursor-pointer">
        {children}
      </div>
    )
  }

  return (
    <Button onClick={handleSave} disabled={isSaving} size="sm" className="relative">
      {isSaving ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Saving...
        </>
      ) : lastSaved ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Saved
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Save Flow
        </>
      )}
      {lastSaved && (
        <div className="absolute -bottom-6 left-0 right-0 text-xs text-muted-foreground text-center">
          {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </Button>
  )
}

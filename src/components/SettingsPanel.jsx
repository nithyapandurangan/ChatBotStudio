import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent } from "./ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { X, Save, Edit2 } from "lucide-react"

export default function SettingsPanel({ node, updateNodeData, onDeselect }) {
  const [text, setText] = useState("")
  const [messageType, setMessageType] = useState("system") // For CustomNode 
  const [textMessageType, setTextMessageType] = useState("sms") // For TextNode 
  const [isEditing, setIsEditing] = useState(false)

  // Sync local state when the selected node changes
  useEffect(() => {
    if (node) {
      setText(node.data?.label || node.data?.condition || "")
      setMessageType(node.data?.messageType || "system")
      setTextMessageType(node.data?.messageType || "sms")
      setIsEditing(false) 
    }
  }, [node])

  // Apply changes to node data and exit edit mode
  const handleUpdate = () => {
    if (node.type === "textNode") {
      updateNodeData(node.id, { label: text, messageType: textMessageType })
    } else if (node.type === "conditionNode") {
      updateNodeData(node.id, { condition: text })
    } else if (node.type === "customNode") {
      updateNodeData(node.id, { label: text, messageType: messageType })
    }
    setIsEditing(false)
  }

  // Handle message type changes for CustomNode and sync immediately
  const handleMessageTypeChange = (value) => {
    setMessageType(value)
    updateNodeData(node.id, { messageType: value })
  }

  // Handle message type changes for TextNode and sync immediately
  const handleTextMessageTypeChange = (value) => {
    setTextMessageType(value)
    updateNodeData(node.id, { messageType: value })
  }

  // Enable edit mode when content area clicked
  const handleTextClick = () => {
    setIsEditing(true)
  }

  // Render placeholder message if no node selected
  if (!node)
    return (
      <div className="flex items-center justify-center h-full text-foreground/60">
        <p className="text-sm">Select a node to edit its properties</p>
      </div>
    )

  // Returns a friendly title based on node type
  const getNodeTitle = () => {
    switch (node.type) {
      case "textNode":
        return "Message Node"
      case "conditionNode":
        return "Condition Node"
      case "customNode":
        return "Custom Message Node"
      default:
        return "Node Settings"
    }
  }

  // Returns appropriate label for content editor based on node type
  const getContentLabel = () => {
    switch (node.type) {
      case "textNode":
        return "Message Content"
      case "conditionNode":
        return "Condition Logic"
      case "customNode":
        return "Message Content"
      default:
        return "Content"
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5">
        {/* Header with node title and deselect button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{getNodeTitle()}</h2>
          <Button variant="ghost" size="icon" onClick={onDeselect} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Message type selector for TextNode */}
          {node.type === "textNode" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Message Type</label>
              <Select value={textMessageType} onValueChange={handleTextMessageTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="messenger">Messenger</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Message type selector for CustomNode */}
          {node.type === "customNode" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Message Type</label>
              <Select value={messageType} onValueChange={handleMessageTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Editable content area with save/cancel buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">{getContentLabel()}</label>

            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                  className="resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdate} size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Show message content in a card; clicking enables editing
              <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={handleTextClick}>
                <CardContent className="p-3 flex items-start gap-2">
                  <div className="flex-1 whitespace-pre-wrap text-sm py-1">
                    {text || <span className="text-muted-foreground italic">Click to edit message...</span>}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { MessageCircle, Settings, FileText, Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog"
import { Button } from "../ui/button"

const messageTypeConfig = {
  system: {
    icon: Settings,
    title: "System Message",
    bgColor: "bg-gray-100 dark:bg-gray-900/40",
    iconColor: "text-gray-600 dark:text-gray-400",
    badgeColor: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400",
  },
  markdown: {
    icon: FileText,
    title: "Markdown Message",
    bgColor: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  },
}

// Enhanced markdown renderer
function renderMarkdown(text) {
  if (!text) return ""
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\n/g, "<br>")
}

function CustomNode({ data, selected, id, deleteNode }) {
  const messageType = data.messageType || "system"
  const config = messageTypeConfig[messageType] || messageTypeConfig.system
  const IconComponent = config.icon

  return (
    <Card
      className={`min-w-[200px] max-w-[300px] transition-all duration-200 cursor-pointer ${
        selected ? "ring-2 ring-primary ring-offset-2 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 p-2 rounded-md ${config.bgColor}`}>
            <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              {" "}
              {/* New flex container */}
              <div className="flex items-center gap-2">
                {" "}
                {/* Group title and badge */}
                <div className="text-sm font-medium text-foreground truncate">{config.title}</div>
                <Badge variant="secondary" className={`text-xs px-1 py-0 ${config.badgeColor}`}>
                  {messageType.toUpperCase()}
                </Badge>
              </div>
              {/* Delete Button moved here */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive" // Removed absolute positioning
                    onClick={(e) => e.stopPropagation()} // Prevent node selection when clicking delete
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the node and all its connections.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteNode(id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div
              className="text-sm text-muted-foreground p-2 bg-muted rounded border-dashed border hover:bg-accent transition-colors h-16 overflow-hidden"
              title="Double-click to edit message"
            >
              {messageType === "markdown" ? (
                <div
                  className="prose prose-xs max-w-none dark:prose-invert line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(data.label || "Click to add your message...") }}
                />
              ) : messageType === "system" ? (
                <div className="italic line-clamp-3">{data.label || "Click to add your message..."}</div>
              ) : (
                <div className="whitespace-pre-wrap line-clamp-3">{data.label || "Click to add your message..."}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary border-2 border-background" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary border-2 border-background" />
    </Card>
  )
}

export default memo(CustomNode)

import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent } from "../ui/card"
import { MessageSquare, MessageCircle, Send, DiscIcon as Discord, TextIcon as Telegram, Trash2 } from "lucide-react"
import { Badge } from "../ui/badge"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog"
import { Button } from "../ui/button"

const messageTypeConfig = {
  sms: {
    icon: Send,
    title: "SMS Message",
    bgColor: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  },
  whatsapp: {
    icon: MessageCircle, 
    title: "WhatsApp Message",
    bgColor: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
  },
  messenger: {
    icon: MessageSquare, 
    title: "Messenger",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400",
  },
  discord: {
    icon: Discord,
    title: "Discord Message",
    bgColor: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400",
  },
}

function TextNode({ data, selected, id, deleteNode }) {
  const messageType = data.messageType || "sms" // Default to SMS
  const config = messageTypeConfig[messageType] || messageTypeConfig.sms
  const IconComponent = config.icon

  return (
    <Card
      className={`relative min-w-[200px] max-w-[300px] transition-all duration-200 cursor-pointer overflow-visible ${
        selected ? "ring-2 ring-primary ring-offset-2 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 p-2 rounded-md ${config.bgColor}`}>
            <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
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
              className="text-sm text-muted-foreground whitespace-pre-wrap p-2 bg-muted rounded border-dashed border hover:bg-accent transition-colors h-16 overflow-hidden"
              title="Double-click to edit message"
            >
              {data.label || "Click to add your message..."}
            </div>
          </div>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary border-2 border-background" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary border-2 border-background" />
    </Card>
  )
}

export default memo(TextNode)

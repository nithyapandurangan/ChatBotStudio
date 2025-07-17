import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"
import { Palette, GitBranch, Send } from "lucide-react" 
import { useMediaQuery } from "../hooks/use-media-query"

export default function NodesPanel({ onNodeTap }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Called when user starts dragging a node item,
  // sets the drag data with the node type so it can be identified on drop
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleNodeClick = (nodeType) => {
    if (!isDesktop && onNodeTap) {
      onNodeTap(nodeType)
    }
  }

  // Define node categories and their node items to display in the panel
  // Each node has a type, label, description, icon, and styling classes
  const NODE_CATEGORIES = [
    {
      title: "Messages",
      nodes: [
        {
          type: "textNode",
          label: "Message",
          description: "Send a simple text message (SMS, WhatsApp, etc.)",
          icon: <Send className="h-5 w-5" />, 
          bg: "bg-blue-100 dark:bg-blue-900/40",
          border: "border-blue-200 dark:border-blue-800",
        },
        {
          type: "customNode",
          label: "Custom Message",
          description: "Send a styled message (System, Markdown)", 
          icon: <Palette className="h-5 w-5" />,
          bg: "bg-purple-100 dark:bg-purple-900/40",
          border: "border-purple-200 dark:border-purple-800",
        },
      ],
    },
    {
      title: "Logic",
      nodes: [
        {
          type: "conditionNode",
          label: "Condition",
          description: "Branch based on input",
          icon: <GitBranch className="h-5 w-5" />,
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          border: "border-yellow-200 dark:border-yellow-800",
        },
      ],
    },
  ]

  return (
    <ScrollArea className="h-full pr-3">
      {!isDesktop && <p className="text-sm text-muted-foreground mb-4">Tap a node to add it to the canvas.</p>}
      <div className="space-y-6 pb-4">
        {/* Render each node category */}
        {NODE_CATEGORIES.map((category) => (
          <div key={category.title} className="space-y-3">
            <div>
              {/* Category title with separator */}
              <h3 className="text-sm font-medium text-foreground/70 mb-2">{category.title}</h3>
              <Separator className="mb-3" />
            </div>

            {/* Render draggable node items */}
            <div className="space-y-3">
              {category.nodes.map((node) => (
                <div
                  key={node.type}
                  onDragStart={isDesktop ? (event) => onDragStart(event, node.type) : undefined}
                  onClick={() => handleNodeClick(node.type)}
                  draggable={isDesktop}
                  className={`p-3 ${node.bg} ${node.border} border rounded-lg cursor-move shadow-sm hover:shadow-md transition-all duration-200 group  ${
                    isDesktop ? "cursor-move" : "cursor-pointer"
                  }`}
                  title={isDesktop ? `Drag to add ${node.label}` : `Tap to add ${node.label}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Node icon with subtle background and hover color changes */}
                    <div className="text-foreground/80 bg-background/80 p-2 rounded-md shadow-sm group-hover:text-primary group-hover:bg-background transition-colors">
                      {node.icon}
                    </div>

                    {/* Node label and description */}
                    <div>
                      <div className="font-medium text-foreground">{node.label}</div>
                      <div className="text-xs text-foreground/70">{node.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Card, CardContent } from "../ui/card"
import { GitBranch } from "lucide-react"

function ConditionNode({ data, selected }) {
  return (
    <div className="relative">
      <Card
        className={`min-w-[240px] transition-all duration-200 cursor-pointer ${
          selected ? "ring-2 ring-primary ring-offset-2 shadow-lg" : "hover:shadow-md"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
              <GitBranch className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground mb-1">Condition</div>
              <div
                className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono border-dashed border hover:bg-accent transition-colors"
                title="Double-click to edit condition"
              >
                {data.condition || "Click to define condition..."}
              </div>
            </div>
          </div>
        </CardContent>

        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary border-2 border-background" />

        {/* True handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 bg-green-500 border-2 border-background"
          style={{ left: "30%" }}
        />

        {/* False handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 bg-red-500 border-2 border-background"
          style={{ left: "70%" }}
        />
      </Card>

      {/* Labels for the handles */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-4">
        <span className="text-xs text-green-600 dark:text-green-400 font-medium">True</span>
        <span className="text-xs text-red-600 dark:text-red-400 font-medium">False</span>
      </div>
    </div>
  )
}

export default memo(ConditionNode)

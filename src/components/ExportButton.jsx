import { useState } from "react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { useToast } from "../hooks/use-toast"
import { Download, FileJson, ImageIcon, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"

export default function ExportButton({ nodes, edges, children }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState(null)
  const { toast } = useToast()
  const { theme } = useTheme()

  // Export flow data as formatted JSON file
  const handleExportJSON = async () => {
    setIsExporting(true)
    setExportType("json")

    try {
      // Prepare flow data with metadata
      const flow = {
        nodes,
        edges,
        metadata: {
          version: "1.0",
          exportedAt: new Date().toISOString(),
          nodeCount: nodes.length,
          edgeCount: edges.length,
        },
      }

      // Create a downloadable JSON blob and trigger download
      const blob = new Blob([JSON.stringify(flow, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      link.download = `chatbot-flow-${timestamp}.json`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: "Flow exported as JSON file.",
      })
    } catch (error) {
      console.error("JSON export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export JSON. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  // Export flow visualization as PNG image
  const handleExportImage = async () => {
    setIsExporting(true)
    setExportType("png")

    try {
      // Dynamic import to reduce bundle size
      const { toPng } = await import("html-to-image")

      const flowElement = document.querySelector(".react-flow")
      if (!flowElement) {
        throw new Error("Flow canvas not found")
      }

      // Get the bounding box of all nodes to crop the image properly
      const nodeElements = flowElement.querySelectorAll(".react-flow__node")
      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY

      nodeElements.forEach((node) => {
        const rect = node.getBoundingClientRect()
        const flowRect = flowElement.getBoundingClientRect()
        const relativeX = rect.left - flowRect.left
        const relativeY = rect.top - flowRect.top

        minX = Math.min(minX, relativeX)
        minY = Math.min(minY, relativeY)
        maxX = Math.max(maxX, relativeX + rect.width)
        maxY = Math.max(maxY, relativeY + rect.height)
      })

      // Add padding around the bounding box
      const padding = 50
      const width = Math.max(800, maxX - minX + padding * 2)
      const height = Math.max(600, maxY - minY + padding * 2)

      // Generate PNG image data with adjusted background and cropping
      const dataUrl = await toPng(flowElement, {
        backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
        width,
        height,
        style: {
          transform: `translate(${padding - minX}px, ${padding - minY}px)`,
        },
        pixelRatio: 2,
      })

      // Create download link
      const link = document.createElement("a")
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      link.download = `chatbot-flow-${timestamp}.png`
      link.href = dataUrl
      link.click()

      toast({
        title: "Export Successful",
        description: "Flow exported as PNG image.",
      })
    } catch (error) {
      console.error("PNG export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  // If custom trigger element (children) is passed, render dropdown around it
  if (children) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">{children}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleExportJSON} disabled={isExporting}>
            <FileJson className="h-4 w-4 mr-2" />
            {isExporting && exportType === "json" ? "Exporting..." : "Export as JSON"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportImage} disabled={isExporting}>
            <ImageIcon className="h-4 w-4 mr-2" />
            {isExporting && exportType === "png" ? "Exporting..." : "Export as PNG"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default export button with dropdown options for JSON and PNG export
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJSON} disabled={isExporting}>
          <FileJson className="h-4 w-4 mr-2" />
          {isExporting && exportType === "json" ? "Exporting..." : "Export as JSON"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportImage} disabled={isExporting}>
          <ImageIcon className="h-4 w-4 mr-2" />
          {isExporting && exportType === "png" ? "Exporting..." : "Export as PNG"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

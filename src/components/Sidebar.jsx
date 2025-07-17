import { useState, useEffect } from "react"
import NodesPanel from "./NodesPanel"
import SettingsPanel from "./SettingsPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import { Settings, Boxes, Github, Linkedin } from "lucide-react"

export default function Sidebar({ selectedNode, updateNodeData, onDeselect, onNodeSelect, onNodeTap }) {
  // Initialize active tab depending on whether a node is selected or not
  const [activeTab, setActiveTab] = useState(selectedNode ? "settings" : "nodes")

  // Effect to switch to 'settings' tab when a node is selected, 
  // and back to 'nodes' tab when none is selected
  useEffect(() => {
    if (selectedNode) {
      setActiveTab("settings")
    } else {
      setActiveTab("nodes")
    }
  }, [selectedNode])

  return (
    <div className="h-full flex flex-col bg-background border-r border-border md:w-80 w-full">
      {/* Header and author info */}
      <div className="p-4">
        <h1 className="text-lg font-semibold text-foreground">ChatBotStudio</h1>
        <p className="text-sm text-muted-foreground">Build your chatbot flow</p>
        <p className="text-xs text-muted-foreground mt-2">
          Drag and drop nodes to design conversational flows, simulate interactions, and export your creations as JSON/PNG.
        </p>

        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Developed by Nithya Pandurangan</p>
          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com/in/nithya-pandurangan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </a>
            <a
              href="https://github.com/nithyapandurangan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              title="GitHub Profile"
            >
              <Github className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        </div>
      </div>

      <Separator />
      {/* Tabs container switching between Nodes and Settings panels */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="nodes" onClick={() => onDeselect()}>
              <Boxes className="h-4 w-4 mr-2" />
              Nodes
            </TabsTrigger>

             {/* Settings tab is disabled if no node is selected */}
            <TabsTrigger value="settings" disabled={!selectedNode}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab contents */}
        <div className="flex-1 overflow-hidden">
          {/* Panel showing all available nodes */}
          <TabsContent value="nodes" className="h-full mt-0 p-4">
            <NodesPanel onNodeTap={onNodeTap} onNodeSelect={onNodeSelect} />
          </TabsContent>

          {/* Panel for editing selected node's settings */}
          <TabsContent value="settings" className="h-full mt-0">
            <SettingsPanel node={selectedNode} updateNodeData={updateNodeData} onDeselect={onDeselect} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

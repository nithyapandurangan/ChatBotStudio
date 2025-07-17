import { useCallback, useEffect, useState } from 'react';
import NodesPanel from './components/NodesPanel';
import FlowCanvas from './components/FlowCanvas';
import SettingsPanel from './components/SettingsPanel';
import SaveButton from './components/SaveButton';
import ExportButton from './components/ExportButton';
import SimulationPanel from './components/SimulationPanel';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('chatbot-flow-nodes');
    return saved ? JSON.parse(saved) : [];
  });
  const [edges, setEdges] = useState(() => {
    const saved = localStorage.getItem('chatbot-flow-edges');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const updateNodeData = (id, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

  const handleNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const handleEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Auto-save logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      const flow = { nodes, edges };
      localStorage.setItem('chatbot-flow-nodes', JSON.stringify(nodes));
      localStorage.setItem('chatbot-flow-edges', JSON.stringify(edges));
      console.log('Auto-saving flow:', flow);
    }, 500);

    return () => clearTimeout(timeout);
  }, [nodes, edges]);

  if (isSimulating) {
    return (
      <div className="h-screen w-screen bg-gray-100">
        <SimulationPanel
          nodes={nodes}
          edges={edges}
          onExit={() => setIsSimulating(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        {selectedNode ? (
          <SettingsPanel
            node={selectedNode}
            updateNodeData={updateNodeData}
            onDeselect={() => setSelectedNode(null)}
          />
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Nodes</h2>
            <NodesPanel />
          </>
        )}
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 bg-white relative">
        <FlowCanvas
          onNodeSelect={setSelectedNode}
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
        />

        <div className="absolute top-4 right-4 flex space-x-2">
          <SaveButton nodes={nodes} edges={edges} />
          <ExportButton nodes={nodes} edges={edges} />
          <button
            onClick={() => setIsSimulating(true)}
            className="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
          >
            {isSimulating ? 'Exit Simulation' : 'Start Simulation'}
          </button>

        </div>
      </div>
    </div>
  );
}

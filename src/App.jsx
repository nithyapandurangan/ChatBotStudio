import { useState } from 'react';
import NodesPanel from './components/NodesPanel';
import FlowCanvas from './components/FlowCanvas';
import SettingsPanel from './components/SettingsPanel';
import SaveButton from './components/SaveButton';

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const updateNodeData = (id, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  };

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
        />

        <div className="absolute top-4 right-4">
          <SaveButton nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  );
}

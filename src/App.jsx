import { useState } from 'react';
import NodesPanel from './components/NodesPanel';
import FlowCanvas from './components/FlowCanvas';

export default function App() {
  const [_selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Nodes Panel */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Nodes</h2>
        <NodesPanel />
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 bg-white">
        <FlowCanvas onNodeSelect={setSelectedNode} />
      </div>
    </div>
  );
}

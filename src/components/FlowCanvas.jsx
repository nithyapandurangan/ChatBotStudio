import { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import TextNode from './CustomNodes/TextNode';

const nodeTypes = {
  textNode: TextNode
};

// Inner component that has access to useReactFlow
function FlowCanvasInner({ onNodeSelect }) {
  const initialNodes = [];
  const initialEdges = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    
    if (typeof type === 'undefined' || !type) {
      return;
    }

    // Get the position relative to the React Flow canvas
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: 'New Message' },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeSelect?.(node)}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-gray-50"
      >
        <Background color="#f1f5f9" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function FlowCanvas({ onNodeSelect }) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner onNodeSelect={onNodeSelect} />
    </ReactFlowProvider>
  );
}

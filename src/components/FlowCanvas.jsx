import { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import 'reactflow/dist/style.css';
import TextNode from './CustomNodes/TextNode';
import ConditionNode from './CustomNodes/ConditionNode';
import CustomNode from './CustomNodes/CustomNode';

const nodeTypes = {
  textNode: TextNode,
  conditionNode: ConditionNode,
  customNode: CustomNode,
};

function FlowCanvasInner({ onNodeSelect, nodes, setNodes, edges, setEdges }) {
  const reactFlowInstance = useReactFlow();

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find(n => n.id === params.source);

    let edgeLabel = '';
    if (sourceNode?.type === 'conditionNode') {
      // Count how many edges already exist from this conditionNode
      const existingEdges = edges.filter(e => e.source === sourceNode.id);
      
      // First edge should be 'true', second should be 'false'
      edgeLabel = existingEdges.length === 0 ? 'true' : 'false';
      
      console.log(`Creating edge from condition node: ${edgeLabel}`);
      console.log(`Existing edges from this node: ${existingEdges.length}`);
    }

    const newEdge = {
      ...params,
      data: { label: edgeLabel }, 
      sourceHandle: edgeLabel,
    };

    console.log('New edge created:', newEdge);

    setEdges((eds) => addEdge(newEdge, eds));
  }, [nodes, edges, setEdges]);

  // Debug: log all edges
  console.log('All edges:', edges.map(e => ({
    source: e.source,
    target: e.target,
    label: e.data?.label,
    sourceHandle: e.sourceHandle,
  })));

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

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create node data based on type
    let nodeData;
    switch (type) {
      case 'textNode':
        nodeData = { label: 'New Message' };
        break;
      case 'conditionNode':
        nodeData = { 
          label: 'New Condition',
          condition: 'true' 
        };
        break;
      case 'customNode':
        nodeData = { 
          label: 'Enter your custom message...',
          messageType: 'system' 
        };
        break;
      default:
        nodeData = { label: 'New Message' };
    }

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: nodeData,
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

export default function FlowCanvas({ onNodeSelect, nodes, setNodes, edges, setEdges }) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner 
        onNodeSelect={onNodeSelect}
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
      />
    </ReactFlowProvider>
  );
}

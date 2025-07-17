import { useEffect, useState } from 'react';

const MAX_SIMULATION_STEPS = 100;

// Minimal markdown renderer, same as in your CustomNode component
function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')             // italic
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded text-xs">$1</code>'); // code
}

export default function SimulationPanel({ nodes, edges, onExit }) {
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  // Find the first node (one with no incoming edges)
  const findStartNode = () => {
    const targets = new Set(edges.map(edge => edge.target));
    return nodes.find(node => !targets.has(node.id));
  };

  const getNextNode = (node) => {
    if (!node) return null;

    if (node.type === 'conditionNode') {
      let result = false;
      try {
        result = eval(node.data.condition); 
      } catch (error) {
        alert(`Invalid condition in node: ${error.message}`);
        return null;
      }

      const resultStr = result.toString().toLowerCase();

      console.log('Looking for edge with label/sourceHandle =', resultStr);
      
      const sourceEdges = edges.filter(e => e.source === node.id);
      sourceEdges.forEach(e => console.log('Edge:', {
        label: e.data?.label,
        sourceHandle: e.sourceHandle
      }));

      const targetEdge = sourceEdges.find(
        (e) => {
          const labelMatch = e.data?.label?.toLowerCase() === resultStr;
          const handleMatch = e.sourceHandle?.toLowerCase() === resultStr;
          console.log(`Edge check: label="${e.data?.label}" (${labelMatch}), handle="${e.sourceHandle}" (${handleMatch})`);
          return labelMatch || handleMatch;
        }
      );

      if (!targetEdge) {
        alert(`No edge found for condition result: ${result}`);
        console.log('Available edges:', sourceEdges.map(e => ({
          label: e.data?.label,
          sourceHandle: e.sourceHandle
        })));
        return null;
      }

      console.log('Found target edge:', targetEdge);
      return nodes.find(n => n.id === targetEdge.target);
    } else {
      // Default linear progression
      const targetEdge = edges.find(e => e.source === node.id);
      if (!targetEdge) return null;
      return nodes.find(n => n.id === targetEdge.target);
    }
  };

  useEffect(() => {
    const start = findStartNode();

    if (!start) {
      alert('No valid start node found. Cannot simulate.');
      onExit();
      return;
    }

    setMessages([]);
    setCurrentNode(start);
    setIsPlaying(true);
    setStepCount(0);
  }, []);

  useEffect(() => {
    if (!isPlaying || !currentNode) return;

    if (stepCount >= MAX_SIMULATION_STEPS) {
      setMessages(prev => [
        ...prev,
        '⚠️ Simulation stopped after 100 steps to prevent infinite loop.'
      ]);
      setIsPlaying(false);
      return;
    }

    const timeout = setTimeout(() => {
      let message;

      if (currentNode.type === 'conditionNode') {
        message = `🧠 Evaluating condition: ${currentNode.data.condition}`;
      } else if (
        currentNode.type === 'customNode' &&
        currentNode.data.messageType === 'markdown'
      ) {
        message = { type: 'markdown', content: currentNode.data.label || '' };
      } else {
        message = currentNode.data.label || '';
      }

      setMessages((prev) => [...prev, message]);

      const next = getNextNode(currentNode);
      if (next) {
        setCurrentNode(next);
        setStepCount((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentNode, isPlaying, stepCount]);

  const handleReset = () => {
    const start = findStartNode();
    setMessages([]);
    setCurrentNode(start);
    setStepCount(0);
    setIsPlaying(true);
  };

  return (
    <div className="p-6 h-full overflow-y-auto flex flex-col justify-between">
      {/* Chat Messages */}
      <div className="space-y-4 mb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg w-fit max-w-xs shadow"
          >
            {typeof msg === 'string' ? (
              msg
            ) : msg.type === 'markdown' ? (
              <div
                className="prose prose-sm max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
            ) : (
              <span>{msg.content}</span>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Exit
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Replay
        </button>
      </div>
    </div>
  );
}

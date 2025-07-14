import { Handle, Position } from 'reactflow';

export default function TextNode({ data, selected }) {
  return (
    <div className={`
      bg-white rounded-lg shadow-md px-4 py-3 min-w-[200px] transition-all
      ${selected 
        ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
        : 'border border-gray-300 hover:border-blue-200'
      }
    `}>
      {/* Node Header */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">💬</span>
        <div className="font-semibold text-sm text-gray-700">Send Message</div>
      </div>
      
      {/* Node Content */}
      <div className="text-gray-800 text-sm bg-gray-50 p-2 rounded border">
        {data.label || 'Enter your message...'}
      </div>
      
      {/* Target Handle (Input) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md"
        style={{ left: -6 }}
      />
      
      {/* Source Handle (Output) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white shadow-md"
        style={{ right: -6 }}
      />
    </div>
  );
}

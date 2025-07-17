import { Handle, Position } from 'reactflow';

export default function ConditionNode({ data, selected }) {
  return (
    <div className={`
      bg-white rounded-lg shadow-md px-4 py-3 min-w-[240px] transition-all
      ${selected 
        ? 'ring-2 ring-yellow-500 shadow-lg scale-105' 
        : 'border border-gray-300 hover:border-yellow-300'
      }
    `}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">🧠</span>
        <div className="font-semibold text-sm text-gray-700">Condition</div>
      </div>

      {/* Content */}
      <div className="text-gray-800 text-sm bg-gray-50 p-2 rounded border">
        {data.condition || 'Define condition...'}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500 border-2 border-white shadow-md"
        style={{ left: -6 }}
      />
      {/* Two outputs: True and False */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-white shadow-md"
        style={{ top: '30%', right: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-white shadow-md"
        style={{ top: '70%', right: -6 }}
      />
    </div>
  );
}

import { Handle, Position } from 'reactflow';

const messageTypeStyles = {
  whatsapp: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    icon: '📱',
    title: 'WhatsApp Message',
    accent: 'bg-green-500'
  },
  system: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    icon: '⚙️',
    title: 'System Message',
    accent: 'bg-gray-500'
  },
  markdown: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    icon: '📄',
    title: 'Markdown Message',
    accent: 'bg-blue-500'
  },
};

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')             // italic
    .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 rounded text-xs">$1</code>'); // code
}

export default function CustomNode({ data, selected }) {
  const type = data.messageType || 'system';
  const label = data.label || 'Enter your custom message...';
  const style = messageTypeStyles[type] || messageTypeStyles.system;

  return (
    <div className={`
      bg-white rounded-lg shadow-md px-4 py-3 min-w-[200px] max-w-[300px] transition-all
      ${selected 
        ? 'ring-2 ring-purple-500 shadow-lg scale-105' 
        : 'border border-gray-300 hover:border-purple-200'
      }
    `}>
      {/* Node Header */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">{style.icon}</span>
        <div className="font-semibold text-sm text-gray-700">{style.title}</div>
      </div>
      
      {/* Message Type Indicator */}
      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${style.accent}`}></div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {type}
        </span>
      </div>
      
      {/* Node Content - Fixed uniform styling */}
      <div className={`text-sm p-3 rounded border ${style.bg} ${style.text} min-h-[60px]`}>
        {type === 'markdown' ? (
          <div
            className="prose prose-sm max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(label) }}
          />
        ) : type === 'system' ? (
          <div className="italic text-sm">
            {label}
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm">
            {label}
          </div>
        )}
      </div>
      
      {/* Target Handle (Input) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white shadow-md"
        style={{ left: -6 }}
      />
      
      {/* Source Handle (Output) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-pink-500 border-2 border-white shadow-md"
        style={{ right: -6 }}
      />
    </div>
  );
}

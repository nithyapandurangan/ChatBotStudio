import { useEffect, useState } from 'react';

export default function SettingsPanel({ node, updateNodeData, onDeselect }) {
  const [text, setText] = useState('');
  const [messageType, setMessageType] = useState('system');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (node) {
      setText(node.data?.label || node.data?.condition || '');
      setMessageType(node.data?.messageType || 'system');
      setIsEditing(false);
    }
  }, [node]);

  const handleUpdate = () => {
    if (node.type === 'textNode') {
      updateNodeData(node.id, { label: text });
    } else if (node.type === 'conditionNode') {
      updateNodeData(node.id, { condition: text });
    } else if (node.type === 'customNode') {
      updateNodeData(node.id, { label: text });
    }
    setIsEditing(false);
  }; 

  const handleMessageTypeChange = (e) => {
    const newType = e.target.value;
    setMessageType(newType);
    updateNodeData(node.id, { messageType: newType });
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  if (!node) return (
    <div className="p-4 text-gray-500">
      Select a node to edit its properties
    </div>
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {node.type === 'textNode' ? 'Message Node' : 
           node.type === 'conditionNode' ? 'Condition Node' : 
           'Custom Message Node'}
        </h2>
        <button
          onClick={onDeselect}
          className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors duration-200"
          title="Close panel"
        >
          ✖
        </button>
      </div>

      <div className="mb-4">
        {/* Message Type Dropdown for CustomNode */}
        {node.type === 'customNode' && (
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Message Type</label>
            <select
              value={messageType}
              onChange={handleMessageTypeChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="system">System</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
        )}

        {/* Dynamic Label */}
        {node.type === 'textNode' && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Content
          </label>
        )}
        {node.type === 'conditionNode' && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition Logic
          </label>
        )}
        {node.type === 'customNode' && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Content
          </label>
        )}

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter your message..."
              rows={4}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={handleTextClick}
            className="p-3 bg-gray-50 border border-gray-200 rounded cursor-text hover:bg-gray-100 transition-colors duration-200"
          >
            <p className="text-gray-800 whitespace-pre-wrap text-sm">
              {text || <span className="text-gray-400 italic">Click to edit message...</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

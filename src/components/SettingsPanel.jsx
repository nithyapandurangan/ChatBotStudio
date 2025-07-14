import { useEffect, useState } from 'react';

export default function SettingsPanel({ node, updateNodeData, onDeselect }) {
  const [text, setText] = useState(node?.data?.label || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setText(node?.data?.label || '');
    setIsEditing(false); // Reset editing state when node changes
  }, [node]);

  const handleUpdate = () => {
    updateNodeData(node.id, { label: text });
    setIsEditing(false); // Exit editing mode after save
  };

  const handleTextClick = () => {
    setIsEditing(true); // Enter editing mode when text is clicked
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
        <h2 className="text-lg font-semibold text-gray-700">Message Node</h2>
        <button
          onClick={onDeselect}
          className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition-colors duration-200"
          title="Close panel"
        >
          ✖
        </button>
      </div>

      {/* Message Content */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message Content
        </label>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
            <p className="text-gray-800 whitespace-pre-wrap">
              {text || <span className="text-gray-400 italic">Click to edit message...</span>}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

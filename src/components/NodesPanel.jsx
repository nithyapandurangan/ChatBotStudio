export default function NodesPanel() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-3">
      <div
        onDragStart={(event) => onDragStart(event, 'textNode')}
        draggable
        className="p-4 bg-white border-2 border-blue-200 rounded-lg cursor-move shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">💬</span>
          <div>
            <div className="font-semibold text-gray-800">Message</div>
            <div className="text-xs text-gray-500">Send a text message</div>
          </div>
        </div>
      </div>
      
      {/* Placeholder for future node types */}
      <div className="text-xs text-gray-400 italic">
        More node types coming soon...
      </div>
    </div>
  );
}

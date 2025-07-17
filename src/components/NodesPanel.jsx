export default function NodesPanel() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
   
  const NODE_CATEGORIES = [
    {
      title: 'Messages',
      nodes: [
        {
          type: 'textNode',
          label: 'Message',
          description: 'Send a simple text message',
          icon: '💬',
          bg: 'bg-blue-100',
        },
        {
          type: 'customNode',
          label: 'Custom Message',
          description: 'Send a styled message (WhatsApp, System, Markdown)',
          icon: '🎨',
          bg: 'bg-purple-100',
        },
      ],
    },
    {
      title: 'Logic',
      nodes: [
        {
          type: 'conditionNode',
          label: 'Condition',
          description: 'Branch based on input',
          icon: '🧠',
          bg: 'bg-yellow-100',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {NODE_CATEGORIES.map((category) => (
        <div key={category.title}>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            {category.title}
          </h3>
          <div className="space-y-3">
            {category.nodes.map((node) => (
              <div
                key={node.type}
                onDragStart={(event) => onDragStart(event, node.type)}
                draggable
                className={`p-4 ${node.bg} border-2 border-gray-200 rounded-lg cursor-move shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{node.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {node.label}
                    </div>
                    <div className="text-xs text-gray-600">{node.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

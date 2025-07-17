export default function SaveButton({ nodes, edges }) {
  const validateFlow = () => {
    // Case 1: No nodes at all
    if (nodes.length === 0) {
      return { isValid: false, message: 'Flow is empty. Please add some nodes.' };
    }

    // Case 2: Single node — always valid (no edges required)
    if (nodes.length === 1) {
      return { isValid: true };
    }

    // Case 3: Multiple nodes but no edges
    if (edges.length === 0) {
      return { isValid: false, message: 'Multiple nodes exist but none are connected.' };
    }

    // Case 4: Find nodes with no incoming edges (potential start nodes)
    const targets = new Set(edges.map(edge => edge.target));
    const startNodes = nodes.filter(node => !targets.has(node.id));

    // Case 4.1: No start node found — flow has cycles or bad structure
    if (startNodes.length === 0) {
      return { isValid: false, message: 'No start node found (all nodes have incoming edges).' };
    }

    // Case 4.2: More than one start node — ambiguous entry point
    if (startNodes.length > 1) {
      return { isValid: false, message: 'Multiple start nodes found. Flow should have only one starting point.' };
    }

    // Case 5: BFS traversal from start node to detect disconnected components
    const startNodeId = startNodes[0].id;
    const visited = new Set();
    const queue = [startNodeId];

    while (queue.length > 0) {
      const current = queue.shift();
      visited.add(current);

      edges.forEach(edge => {
        if (edge.source === current && !visited.has(edge.target)) {
          queue.push(edge.target);
        }
      });
    }

    // Case 6: Not all nodes were visited — flow has disconnected pieces
    if (visited.size !== nodes.length) {
      return { isValid: false, message: 'Flow contains disconnected nodes. All nodes must be connected.' };
    }

    // Case 7: All validations passed
    return { isValid: true };
  };

  const handleSave = () => {
    const validation = validateFlow();

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const flow = { nodes, edges };

    // Persist to localStorage or API
    console.log('Flow Saved:', flow);
    alert('Flow saved successfully. Check console for output.');
  };

  return (
    <button
      onClick={handleSave}
      className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
    >
      Save Flow
    </button>
  );
}

export default function SaveButton({ nodes, edges }) {
  const validateFlow = () => {
    // Case 1: No nodes at all
    if (nodes.length === 0) {
      return { isValid: false, message: 'Flow is empty. Please add some nodes.' };
    }

    // Case 2: Single node - always valid
    if (nodes.length === 1) {
      return { isValid: true };
    }

    // Case 3: Multiple nodes but no edges
    if (edges.length === 0) {
      return { isValid: false, message: 'Multiple nodes exist but none are connected.' };
    }

    // Build a map of source nodes for quick lookup
    const sourceNodes = new Set(edges.map(edge => edge.source));
    
    // Find nodes that aren't sources (potential end nodes)
    const endNodes = nodes.filter(node => !sourceNodes.has(node.id));

    // Case 4: More than one end node
    if (endNodes.length > 1) {
      return { 
        isValid: false, 
        message: 'Flow can only have one end point. Multiple nodes have no outgoing connections.' 
      };
    }

    // Case 5: Check for disconnected components
    const visited = new Set();
    const queue = [nodes[0].id]; // Start with first node
    
    while (queue.length > 0) {
      const current = queue.shift();
      visited.add(current);
      
      // Add connected nodes to queue
      edges.forEach(edge => {
        if (edge.source === current && !visited.has(edge.target)) {
          queue.push(edge.target);
        }
      });
    }

    // If not all nodes are visited, there's a disconnected component
    if (visited.size !== nodes.length) {
      return { 
        isValid: false, 
        message: 'Flow contains disconnected nodes. All nodes must be connected.' 
      };
    }

    // All checks passed
    return { isValid: true };
  };

  const handleSave = () => {
    const validation = validateFlow();
    
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const flow = {
      nodes,
      edges,
    };

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

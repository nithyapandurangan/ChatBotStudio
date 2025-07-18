// Simple default flow that's easy to understand and demonstrates key features
export const initialNodes = [
  {
    id: "start",
    type: "textNode",
    position: { x: 250, y: 50 },
    data: { label: "👋 Hello! I'm your virtual assistant. How can I help you?", messageType: "sms" },
  },
  {
    id: "wait-for-input",
    type: "conditionNode",
    position: { x: 250, y: 180 },
    data: { 
      label: "Check User Input", 
      condition: "input.length > 0" // Simple condition: user provided any input
    },
  },
  {
    id: "helpful-response",
    type: "customNode",
    position: { x: 100, y: 320 },
    data: { 
      label: "**Great!** I received your message. Let me help you with that.\n\n*This is a demo conversation flow.*", 
      messageType: "markdown" 
    },
  },
  {
    id: "no-input-response",
    type: "textNode",
    position: { x: 400, y: 320 },
    data: { 
      label: "I'm still here waiting for your message! Feel free to type anything.", 
      messageType: "sms" 
    },
  },
  {
    id: "follow-up",
    type: "textNode",
    position: { x: 100, y: 480 },
    data: { 
      label: "Is there anything else I can help you with today?", 
      messageType: "sms" 
    },
  },
  {
    id: "final-message",
    type: "customNode",
    position: { x: 250, y: 620 },
    data: { 
      label: "Thank you for trying our **Chatbot Studio**! 🚀\n\nYou can:\n- Edit messages by clicking on nodes\n- Add new nodes from the sidebar\n- Connect nodes by dragging handles\n- Test different flows with the simulation", 
      messageType: "markdown" 
    },
  },
]

export const initialEdges = [
  {
    id: "start-to-condition",
    source: "start",
    target: "wait-for-input",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "condition-true-path",
    source: "wait-for-input",
    sourceHandle: "true",
    target: "helpful-response",
    type: "smoothstep",
    label: "Has Input",
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "condition-false-path",
    source: "wait-for-input",
    sourceHandle: "false",
    target: "no-input-response",
    type: "smoothstep",
    label: "No Input",
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "helpful-to-followup",
    source: "helpful-response",
    target: "follow-up",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "no-input-to-final",
    source: "no-input-response",
    target: "final-message",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "followup-to-final",
    source: "follow-up",
    target: "final-message",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
  },
]

// Alternative even simpler flow for absolute beginners
export const beginner_initialNodes = [
  {
    id: "greeting",
    type: "textNode",
    position: { x: 200, y: 50 },
    data: { label: "Hi there! Welcome to Chatbot Studio! 👋", messageType: "sms" },
  },
  {
    id: "explanation",
    type: "customNode",
    position: { x: 200, y: 200 },
    data: { 
      label: "This is a **demo chatbot flow**.\n\nYou can:\n- ✏️ Edit this message\n- ➕ Add new nodes\n- 🔗 Connect nodes\n- ▶️ Test with simulation", 
      messageType: "markdown" 
    },
  },
  {
    id: "simple-condition",
    type: "conditionNode",
    position: { x: 200, y: 380 },
    data: { 
      label: "Simple Check", 
      condition: "true" // Always true for demo
    },
  },
  {
    id: "final",
    type: "textNode",
    position: { x: 200, y: 520 },
    data: { label: "Thanks for exploring! Try editing me or adding new nodes.", messageType: "sms" },
  },
]

export const beginner_initialEdges = [
  {
    id: "greeting-to-explanation",
    source: "greeting",
    target: "explanation",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "explanation-to-condition",
    source: "explanation",
    target: "simple-condition",
    type: "smoothstep",
    markerEnd: { type: "arrowclosed" },
  },
  {
    id: "condition-to-final",
    source: "simple-condition",
    sourceHandle: "true",
    target: "final",
    type: "smoothstep",
    label: "true",
    markerEnd: { type: "arrowclosed" },
  },
]

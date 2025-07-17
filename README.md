# ChatBotStudio

ChatBotStudio is a modern, interactive chatbot flow builder built with React, Tailwind CSS, and React Flow.  It empowers users to design conversational flows visually with powerful features such as:

- 🧱 Drag-and-Drop Node System
- 💬 Customizable & Editable Message Types (Text, Markdown, System)
- 🧠 Conditional Logic Support
- 🔁 Flow simulation mode with loop handling
- 🎨 Node categories for organization
- 💾 Auto-save to Local Storage
- 📤 Export to JSON/image

Built with extensibility and testability in mind. Ideal for visual chatbot prototyping.

## Development Progress

### Phase 1: Core Functionality Implementation

- 💬 Message Node (TextNode) implementation
- 🔗 Drag & Drop support in Node Panel using React Flow
- 🔌 Connection handles for Nodes (Source/Target)
- ⚙️ React Flow integration

### Phase 2: Node Editing and Flow Validation

- 📝 Text Node editing functionality
- ✏️ Settings Panel implementation for editing node-specific data
- 🔍 Flow validation for disconnected nodes, start/end node checks and more
- 💾 Save functionality for error handling

### Phase 3: Auto-Save, Custom Node and Export Functionality

- 💾 Auto-save support using `localStorage`
- 📤 Export flow as JSON for re-importing/sharing
- 📤 Export flow as PNG image including nodes, edges, and layout (using html2canvas)
- 🔌 Simulation mode with conditional and custom logic handling
- 🚦 Looping Support to allow connecting a node to previous node with a max step limit of 100
- ⚙️ Custom Node Support to create nodes with custom logic like Whatsapp, Markdown, System Messages

### Phase 4 : UI Enhancements

- 🎨 Dark Mode and Theme Switching
- ✨ Improved Node Styling by adding icons, colour-coded borders, shadows and hover effects
- 🖼️ Added Radix-ui & CVA (Class Variance Authority) for better styled UI components
- 🚀 Responsive Design for better user experience

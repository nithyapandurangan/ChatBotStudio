# ChatBotStudio

ChatBotStudio is a modern, interactive chatbot flow builder designed to empower users to visually design and simulate conversational flows. Built with a focus on intuitive UI and robust functionality, it's ideal for prototyping and visualizing complex chatbot interactions.

## Features

- **🧱 Drag-and-Drop Node System:** Easily add and arrange conversational nodes on the canvas.
- **💬 Customizable & Editable Message Types:** Create diverse messages including:
  - **Text Messages:** For SMS, WhatsApp, Telegram, Messenger, Discord.
  - **Custom Messages:** Markdown-rich content and system-level messages.
- **🧠 Conditional Logic Support:** Implement branching logic based on user-defined expressions.
- **🔁 Flow Simulation Mode:** Run the chatbot logic visually with automatic progression through nodes
- **🎨 Node Categories:** Organized sidebar with categories for quick access.
- **💾 Auto-save to Local Storage:** Changes are automatically persisted.
- **📤 Flexible Export Options:**
  - Export as **JSON** to save or share your flows
  - Export as **PNG** for presentations and documentation
- **🌙 Dark Mode & Theme Switching:** Seamless light/dark toggle.

Built with extensibility and testability in mind. Ideal for visual chatbot prototyping.

## Development Progress - In Progress

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

### Phase 5 : Mobile Responsiveness Optimization

- 📱 Improved mobile responsiveness for better user experience
- 📱 Menu and Node Panel adjustments for better mobile usability

## Tech Stack

- **Frontend Framework**: React (with React Hooks)
- **Styling**: Tailwind CSS, Radix UI, Class Variance Authority (CVA)
- **Drag & Drop & Flow Visualization**: React Flow
- **State Management**: React useState, useEffect, useCallback 
- **Theming**: next-themes (Dark/Light Mode)
- **UI Components**: Radix UI (Sheet, Tabs, Buttons, Separator, Toasts, etc.)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Responsive Utilities**: Custom media query hook (useMediaQuery) for device detection

## 🤝 Contributing

Have a feature idea or bug fix? Fork the repo and submit a PR. Contributions of all kinds are welcome!

Created with ❤️ by Nithya Pandurangan!

# Cartpanda Funnel Builder

A drag-and-drop upsell funnel builder created for the Cartpanda Front-end Engineer Practical Test.

## 🚀 Live Demo

[View Demo](https://id-preview--6704f845-ac36-435c-b881-e94f754e948a.lovable.app)

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Flow** (@xyflow/react) - Node-based canvas
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components

## 🏗️ Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ✨ Features

### Core Requirements (MVP)

- ✅ **Infinite Canvas** - Pan around freely, grid background, zoom controls
- ✅ **Node Types** - Sales Page, Order Page, Upsell, Downsell, Thank You
- ✅ **Drag from Palette** - Left sidebar with draggable node templates
- ✅ **Visual Connections** - Connect nodes with animated arrows
- ✅ **Funnel Rules**:
  - Thank You pages cannot have outgoing connections
  - Upsell/Downsell titles auto-increment (Upsell 1, Upsell 2, etc.)
  - Validation warnings for orphan nodes
- ✅ **Persistence** - Auto-saves to localStorage
- ✅ **Export/Import** - JSON export and import functionality

### Bonus Features

- ✅ **Zoom in/out** - Via controls or scroll wheel
- ✅ **Snap to grid** - 20px grid alignment
- ✅ **Mini-map** - Overview panel for navigation
- ✅ **Node/Edge deletion** - Select and press Delete/Backspace
- ✅ **Validation panel** - Shows funnel issues (orphan nodes, missing connections)

## 📁 Architecture

```
src/
├── components/
│   ├── funnel/
│   │   ├── FunnelCanvas.tsx    # Main canvas with React Flow
│   │   ├── FunnelNode.tsx      # Custom node component
│   │   ├── FunnelToolbar.tsx   # Top toolbar with actions
│   │   └── NodePalette.tsx     # Left sidebar with node types
│   └── ui/                     # shadcn/ui components
├── hooks/
│   └── useFunnelStore.ts       # State management for nodes/edges
├── types/
│   └── funnel.ts               # TypeScript types & node configs
└── pages/
    └── Index.tsx               # Main entry page
```

### Key Architecture Decisions

1. **Custom Node Component**: Each funnel node is a self-contained component with its own styling based on type (sales, order, upsell, etc.)

2. **Centralized State Hook**: `useFunnelStore` manages all node/edge state, validation, and persistence logic

3. **Type-Safe Configuration**: Node types are defined with full configuration (icons, colors, labels) in a central config object

4. **Design System**: All colors use CSS variables for theming consistency

## ♿ Accessibility

- **Keyboard navigation**: Tab through palette items, use Delete key to remove nodes
- **ARIA labels**: All interactive elements have proper labels
- **Focus indicators**: Visible focus rings on all interactive elements
- **Screen reader support**: Semantic HTML structure with role attributes
- **Color contrast**: All text meets WCAG AA contrast requirements
- **Descriptive icons**: Emoji icons include aria-labels

### Known Accessibility Limitations

- React Flow's internal canvas interactions rely primarily on mouse input
- Complex drag-and-drop operations may require mouse for optimal experience
- Minimap is primarily a visual aid

## 📄 Dashboard Architecture

See [docs/dashboard-architecture.md](./docs/dashboard-architecture.md) for the written answer to Part 2 of the assessment.

## 🎨 Design Decisions

### Visual Design

- **Professional SaaS aesthetic**: Clean, minimal interface with clear visual hierarchy
- **Color-coded nodes**: Each node type has a distinct color for quick identification
- **Smooth animations**: Subtle transitions for drag operations and connections

### UX Decisions

- **Auto-save**: Changes persist automatically to reduce data loss
- **Inline validation**: Issues shown in toolbar, not blocking modals
- **Progressive disclosure**: Tips in sidebar, controls appear on hover

### Trade-offs Made

1. **No real-time collaboration**: Kept scope to single-user localStorage
2. **No undo/redo**: Would add complexity; focused on core functionality
3. **No node editing**: Titles/buttons are static; would be a natural next step
4. **Simple validation**: Basic rules checked; more complex funnel validation could be added

## 📝 License

MIT

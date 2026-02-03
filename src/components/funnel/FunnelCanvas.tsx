import { useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodeType, FunnelNodeData } from '@/types/funnel';
import { useFunnelStore } from '@/hooks/useFunnelStore';
import FunnelNodeComponent from './FunnelNode';
import NodePalette from './NodePalette';
import FunnelToolbar from './FunnelToolbar';

type FunnelNode = Node<FunnelNodeData>;

const nodeTypes = {
  funnelNode: FunnelNodeComponent,
};

function FunnelCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    exportFunnel,
    importFunnel,
    clearFunnel,
    getValidationIssues,
  } = useFunnelStore();

  const validationIssues = useMemo(() => getValidationIssues(), [getValidationIssues, nodes, edges]);

  const onDragStart = useCallback((type: NodeType, event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeDelete = useCallback(() => {
    // Handled by React Flow via onNodesChange
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <FunnelToolbar
        onExport={exportFunnel}
        onImport={importFunnel}
        onClear={clearFunnel}
        validationIssues={validationIssues}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <NodePalette onDragStart={onDragStart} />
        
        <main 
          ref={reactFlowWrapper} 
          className="flex-1 h-full"
          aria-label="Funnel canvas"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { strokeWidth: 2 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="hsl(var(--canvas-grid))"
            />
            <Controls 
              className="!shadow-lg !rounded-lg !border !border-border"
              showInteractive={false}
            />
            <MiniMap 
              className="!bg-card !rounded-lg !border !border-border"
              nodeColor={(node) => {
                const data = node.data as FunnelNodeData;
                const colors: Record<string, string> = {
                  sales: 'hsl(259, 85%, 60%)',
                  order: 'hsl(217, 91%, 55%)',
                  upsell: 'hsl(142, 76%, 45%)',
                  downsell: 'hsl(25, 95%, 53%)',
                  thankyou: 'hsl(330, 81%, 60%)',
                };
                return colors[data.type] || '#888';
              }}
              maskColor="hsl(var(--background) / 0.7)"
              pannable
              zoomable
            />
          </ReactFlow>
        </main>
      </div>
    </div>
  );
}

export default function FunnelCanvas() {
  return (
    <ReactFlowProvider>
      <FunnelCanvasInner />
    </ReactFlowProvider>
  );
}

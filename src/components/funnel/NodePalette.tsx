import { memo } from 'react';
import { NodeType, NODE_TYPE_CONFIG } from '@/types/funnel';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface NodePaletteProps {
  onDragStart: (type: NodeType, event: React.DragEvent) => void;
}

const NodePalette = memo(({ onDragStart }: NodePaletteProps) => {
  const nodeTypes = Object.entries(NODE_TYPE_CONFIG) as [NodeType, typeof NODE_TYPE_CONFIG[NodeType]][];

  const colorClasses: Record<string, string> = {
    'node-sales': 'border-l-[hsl(var(--node-sales))] hover:bg-[hsl(var(--node-sales)/0.1)]',
    'node-order': 'border-l-[hsl(var(--node-order))] hover:bg-[hsl(var(--node-order)/0.1)]',
    'node-upsell': 'border-l-[hsl(var(--node-upsell))] hover:bg-[hsl(var(--node-upsell)/0.1)]',
    'node-downsell': 'border-l-[hsl(var(--node-downsell))] hover:bg-[hsl(var(--node-downsell)/0.1)]',
    'node-thankyou': 'border-l-[hsl(var(--node-thankyou))] hover:bg-[hsl(var(--node-thankyou)/0.1)]',
  };

  return (
    <aside 
      className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full"
      aria-label="Node palette"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-sidebar-foreground">Node Palette</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag nodes to the canvas
        </p>
      </div>

      {/* Node types */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto" role="list">
        {nodeTypes.map(([type, config]) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => onDragStart(type, e)}
            className={cn(
              'p-3 rounded-lg border-l-4 bg-card cursor-grab active:cursor-grabbing',
              'transition-all duration-150 hover:shadow-md group',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              colorClasses[config.color]
            )}
            role="listitem"
            tabIndex={0}
            aria-label={`Drag ${config.label} node`}
          >
            <div className="flex items-start gap-3">
              <div className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                <GripVertical className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg" role="img" aria-hidden>
                    {config.icon}
                  </span>
                  <span className="font-medium text-sm text-foreground">
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </nav>

      {/* Help */}
      <div className="p-4 border-t border-sidebar-border bg-muted/30">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Tips
        </h3>
        <ul className="mt-2 text-xs text-muted-foreground space-y-1">
          <li>• Drag nodes to create pages</li>
          <li>• Connect handles to link pages</li>
          <li>• Thank You has no outgoing links</li>
        </ul>
      </div>
    </aside>
  );
});

NodePalette.displayName = 'NodePalette';

export default NodePalette;

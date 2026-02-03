import { memo } from 'react';
import { Handle, Position, type Node } from '@xyflow/react';
import { FunnelNodeData, NODE_TYPE_CONFIG } from '@/types/funnel';
import { cn } from '@/lib/utils';

type FunnelNodeType = Node<FunnelNodeData>;

interface FunnelNodeComponentProps {
  id: string;
  data: FunnelNodeData;
  selected?: boolean;
}

const FunnelNode = memo(({ data, selected, id }: FunnelNodeComponentProps) => {
  const config = NODE_TYPE_CONFIG[data.type];
  const isThankYou = data.type === 'thankyou';

  const colorClasses: Record<string, string> = {
    'node-sales': 'border-t-[hsl(var(--node-sales))] bg-gradient-to-b from-[hsl(var(--node-sales)/0.1)] to-transparent',
    'node-order': 'border-t-[hsl(var(--node-order))] bg-gradient-to-b from-[hsl(var(--node-order)/0.1)] to-transparent',
    'node-upsell': 'border-t-[hsl(var(--node-upsell))] bg-gradient-to-b from-[hsl(var(--node-upsell)/0.1)] to-transparent',
    'node-downsell': 'border-t-[hsl(var(--node-downsell))] bg-gradient-to-b from-[hsl(var(--node-downsell)/0.1)] to-transparent',
    'node-thankyou': 'border-t-[hsl(var(--node-thankyou))] bg-gradient-to-b from-[hsl(var(--node-thankyou)/0.1)] to-transparent',
  };

  const buttonColors: Record<string, string> = {
    'node-sales': 'bg-[hsl(var(--node-sales))]',
    'node-order': 'bg-[hsl(var(--node-order))]',
    'node-upsell': 'bg-[hsl(var(--node-upsell))]',
    'node-downsell': 'bg-[hsl(var(--node-downsell))]',
    'node-thankyou': 'bg-[hsl(var(--node-thankyou))]',
  };

  return (
    <div
      className={cn(
        'node-enter w-[200px] rounded-lg border-t-4 bg-card shadow-node transition-all duration-200',
        colorClasses[config.color],
        selected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {/* Target handle (incoming) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!-top-1.5"
        id={`${id}-target`}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label={config.label}>
            {config.icon}
          </span>
          <span className="font-medium text-sm text-foreground truncate">
            {data.title}
          </span>
        </div>
      </div>

      {/* Preview area */}
      <div className="p-3">
        <div className="w-full h-16 rounded bg-muted/50 flex items-center justify-center text-muted-foreground text-xs border border-border/30">
          Page Preview
        </div>
      </div>

      {/* Button */}
      <div className="px-3 pb-3">
        <div
          className={cn(
            'w-full py-2 px-3 rounded text-center text-xs font-medium text-white truncate',
            buttonColors[config.color]
          )}
        >
          {data.buttonLabel}
        </div>
      </div>

      {/* Source handle (outgoing) - hidden for Thank You */}
      {!isThankYou && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!-bottom-1.5"
          id={`${id}-source`}
        />
      )}
    </div>
  );
});

FunnelNode.displayName = 'FunnelNode';

export default FunnelNode;

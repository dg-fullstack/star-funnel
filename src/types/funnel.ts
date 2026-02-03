export type NodeType = 'sales' | 'order' | 'upsell' | 'downsell' | 'thankyou';

export interface FunnelNodeData extends Record<string, unknown> {
  type: NodeType;
  title: string;
  buttonLabel: string;
  thumbnail?: string;
}

export interface FunnelState {
  nodes: import('@xyflow/react').Node<FunnelNodeData>[];
  edges: import('@xyflow/react').Edge[];
}

export const NODE_TYPE_CONFIG: Record<NodeType, {
  label: string;
  icon: string;
  defaultButton: string;
  color: string;
  description: string;
}> = {
  sales: {
    label: 'Sales Page',
    icon: '📄',
    defaultButton: 'Buy Now',
    color: 'node-sales',
    description: 'Landing page to capture interest',
  },
  order: {
    label: 'Order Page',
    icon: '🛒',
    defaultButton: 'Complete Order',
    color: 'node-order',
    description: 'Checkout and payment form',
  },
  upsell: {
    label: 'Upsell',
    icon: '⬆️',
    defaultButton: 'Yes, Add This!',
    color: 'node-upsell',
    description: 'Offer an upgrade or add-on',
  },
  downsell: {
    label: 'Downsell',
    icon: '⬇️',
    defaultButton: 'Get This Instead',
    color: 'node-downsell',
    description: 'Alternative lower-priced offer',
  },
  thankyou: {
    label: 'Thank You',
    icon: '✅',
    defaultButton: 'View Order',
    color: 'node-thankyou',
    description: 'Order confirmation page',
  },
};

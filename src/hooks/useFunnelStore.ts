import { useCallback, useEffect, useState } from 'react';
import {
  Node,
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import { FunnelNodeData, FunnelState, NodeType, NODE_TYPE_CONFIG } from '@/types/funnel';

const STORAGE_KEY = 'cartpanda-funnel-state';

const getInitialState = (): FunnelState => {
  if (typeof window === 'undefined') return { nodes: [], edges: [] };
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load funnel state from localStorage:', e);
  }
  
  return { nodes: [], edges: [] };
};

export function useFunnelStore() {
  const [nodes, setNodes] = useState<Node<FunnelNodeData>[]>(() => getInitialState().nodes);
  const [edges, setEdges] = useState<Edge[]>(() => getInitialState().edges);
  const [nodeCounters, setNodeCounters] = useState<Record<NodeType, number>>({
    sales: 0,
    order: 0,
    upsell: 0,
    downsell: 0,
    thankyou: 0,
  });

  // Initialize counters from existing nodes
  useEffect(() => {
    const counters: Record<NodeType, number> = {
      sales: 0,
      order: 0,
      upsell: 0,
      downsell: 0,
      thankyou: 0,
    };
    
    nodes.forEach((node) => {
      const type = node.data.type;
      counters[type]++;
    });
    
    setNodeCounters(counters);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    } catch (e) {
      console.warn('Failed to save funnel state:', e);
    }
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<FunnelNodeData>>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // Find source node to check rules
      const sourceNode = nodes.find((n) => n.id === connection.source);
      
      // Thank You nodes cannot have outgoing edges
      if (sourceNode?.data.type === 'thankyou') {
        return;
      }
      
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [nodes]
  );

  const addNode = useCallback(
    (type: NodeType, position: { x: number; y: number }) => {
      const config = NODE_TYPE_CONFIG[type];
      const newCounter = nodeCounters[type] + 1;
      
      // Generate title with number for upsell/downsell
      let title = config.label;
      if (type === 'upsell' || type === 'downsell') {
        title = `${config.label} ${newCounter}`;
      }
      
      const newNode: Node<FunnelNodeData> = {
        id: `${type}-${Date.now()}`,
        type: 'funnelNode',
        position,
        data: {
          type,
          title,
          buttonLabel: config.defaultButton,
        },
      };
      
      setNodes((nds) => [...nds, newNode]);
      setNodeCounters((prev) => ({ ...prev, [type]: newCounter }));
      
      return newNode.id;
    },
    [nodeCounters]
  );

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, []);

  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, []);

  const exportFunnel = useCallback(() => {
    const state: FunnelState = { nodes, edges };
    return JSON.stringify(state, null, 2);
  }, [nodes, edges]);

  const importFunnel = useCallback((json: string) => {
    try {
      const state: FunnelState = JSON.parse(json);
      if (Array.isArray(state.nodes) && Array.isArray(state.edges)) {
        setNodes(state.nodes);
        setEdges(state.edges);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const clearFunnel = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNodeCounters({
      sales: 0,
      order: 0,
      upsell: 0,
      downsell: 0,
      thankyou: 0,
    });
  }, []);

  // Validation
  const getValidationIssues = useCallback(() => {
    const issues: string[] = [];
    
    // Find orphan nodes (no connections)
    const connectedNodeIds = new Set<string>();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    const orphanNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));
    if (orphanNodes.length > 0 && nodes.length > 1) {
      issues.push(`${orphanNodes.length} orphan node(s) without connections`);
    }
    
    // Check Sales Page rules
    const salesNodes = nodes.filter((n) => n.data.type === 'sales');
    salesNodes.forEach((salesNode) => {
      const outgoingEdges = edges.filter((e) => e.source === salesNode.id);
      if (outgoingEdges.length === 0 && nodes.length > 1) {
        issues.push(`"${salesNode.data.title}" needs a connection to Order Page`);
      }
    });
    
    // Check Thank You nodes shouldn't have outgoing
    const thankyouNodes = nodes.filter((n) => n.data.type === 'thankyou');
    thankyouNodes.forEach((tyNode) => {
      const outgoingEdges = edges.filter((e) => e.source === tyNode.id);
      if (outgoingEdges.length > 0) {
        issues.push(`"${tyNode.data.title}" should not have outgoing connections`);
      }
    });
    
    return issues;
  }, [nodes, edges]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    deleteEdge,
    exportFunnel,
    importFunnel,
    clearFunnel,
    getValidationIssues,
  };
}

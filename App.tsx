
import React, { useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge as ReactFlowEdge,
  Node,
} from 'reactflow';

import { AgentState, Message, NodeData, NodeType } from './types';
import AgentPanel from './components/AgentPanel';
import CollapsedAgentIcon from './components/CollapsedAgentIcon';
import StartNode from './components/StartNode';
import CombineNode from './components/CombineNode';
import CollapsedCombineNode from './components/CollapsedCombineNode';
import WorkflowControls from './components/WorkflowControls';
import AgentSettingsModal from './components/AgentSettingsModal';
import { sendMessageStream } from './services/geminiService';
import { Chat } from '@google/genai';
import { AGENT_COLORS } from './constants';
import { ToastProvider, useToast } from './src/design-system/components/Toast';
import { useAccessibility } from './src/design-system/hooks/useAccessibility';

const AppContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nextNodeId, setNextNodeId] = useState(1);
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running'>('idle');
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  const { addToast } = useToast();
  const { announce } = useAccessibility({ announceChanges: true });
  
  const chatInstances = useRef<Map<string, { chat: Chat; systemInstruction: string }>>(new Map());

  const updateNodeState = (nodeId: string, updateFn: (agent: AgentState) => Partial<AgentState>) => {
    setNodes(nds => nds.map(node => {
      if (node.id !== nodeId) return node;

      const update = updateFn(node.data.agentState);
      const updatedAgentState = { ...node.data.agentState, ...update };

      const newNode = {
        ...node,
        data: {
          ...node.data,
          agentState: updatedAgentState,
        },
      };

      return newNode;
    }));
  };
  
  const updateNodeStateField = <K extends keyof AgentState>(id:string, key: K, value: AgentState[K]) => {
     updateNodeState(id, () => ({ [key]: value }));
  };

  const addNode = useCallback((type: NodeType) => {
    const id = `${type}-${nextNodeId}`;
    let newNode: Node<NodeData>;
    
    const commonData = {
        onStateChange: updateNodeStateField,
        onClose: removeNode,
        onToggleCollapse: toggleCollapseNode,
        onSettingsOpen: (nodeId: string) => setEditingNode(nodes.find(n => n.id === nodeId) || null),
    };
    
    const commonState: Partial<AgentState> = {
        id,
        status: 'idle',
        messages: [],
        lastOutput: null,
        isCollapsed: false,
    };

    const position = { x: 200 + (nextNodeId % 10) * 50, y: 100 + Math.floor(nextNodeId / 10) * 50 };

    switch (type) {
        case 'start':
            newNode = {
                id, type, position,
                data: {
                    ...commonData,
                    agentState: { ...commonState, name: 'Start', startValue: 'Write a poem about robots.', color: '#4ade80' } as AgentState,
                }
            };
            break;
        case 'combine':
            newNode = {
                id, type, position,
                data: {
                    ...commonData,
                    agentState: { ...commonState, name: 'Combine Inputs', template: 'Input 1:\n{{input_1}}\n\nInput 2:\n{{input_2}}', receivedInputs: {}, color: '#facc15', size: { width: 384, height: 200 } } as AgentState,
                },
                style: { width: 384, height: 200 },
            };
            break;
        case 'agentPanel':
        default:
             const agentId = `Agent ${nextNodeId}`;
             const agentState: AgentState = {
                ...commonState,
                name: agentId,
                size: { width: 450, height: 550 },
                model: 'gemini-2.5-flash',
                systemPrompt: 'You are a helpful and futuristic AI assistant.',
                userPromptTemplate: '{{input}}',
                color: AGENT_COLORS[(nextNodeId - 1) % AGENT_COLORS.length],
             } as AgentState;
             newNode = {
                id, type: 'agentPanel', position,
                data: { ...commonData, agentState },
                style: { width: agentState.size.width, height: agentState.size.height },
                         };
            break;
    }

    setNodes(nds => nds.concat(newNode));
    setNextNodeId(prev => prev + 1);
  }, [nextNodeId, setNodes, nodes]);

  const removeNode = (id: string) => {
    setNodes(nds => nds.filter(node => node.id !== id));
    setEdges(eds => eds.filter(edge => edge.source !== id && edge.target !== id));
    chatInstances.current.delete(id);
  };
  
  const toggleCollapseNode = (id: string, type: 'agentPanel' | 'combine') => {
    setNodes(nds => nds.map(node => {
        if (node.id !== id) return node;

        const isCollapsing = !node.data.agentState.isCollapsed;
        let newType: NodeType;
        let newSize: { width: number; height: number };

        if (type === 'agentPanel') {
            newType = isCollapsing ? 'collapsedAgent' : 'agentPanel';
            newSize = isCollapsing ? { width: 64, height: 64 } : { width: 450, height: 550 };
        } else { // combine
            newType = isCollapsing ? 'collapsedCombine' : 'combine';
            newSize = isCollapsing ? { width: 80, height: 80 } : { width: 384, height: 200 };
        }

        return {
            ...node,
            type: newType,
            style: { ...node.style, ...newSize },
            data: { ...node.data, agentState: { ...node.data.agentState, isCollapsed: isCollapsing, size: newSize } }
        };
    }));
  };

  const executeWorkflow = async () => {
    setWorkflowStatus('running');
    announce('Workflow execution started', 'polite');
    addToast({
      type: 'info',
      title: 'Workflow Started',
      description: 'Your AI workflow is now running...'
    });
    resetWorkflowState();
    
    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) {
        console.error("Workflow failed: No Start Node found.");
        addToast({
          type: 'error',
          title: 'Workflow Failed',
          description: 'No Start Node found. Please add a Start Node to begin.'
        });
        setWorkflowStatus('idle');
        return;
    }
    
    updateNodeState(startNode.id, s => ({ status: 'running' }));
    await new Promise(res => setTimeout(res, 50));

    const startValue = startNode.data.agentState.startValue || "";
    updateNodeState(startNode.id, s => ({ status: 'completed', lastOutput: startValue }));
    
    const downstreamEdges = edges.filter(e => e.source === startNode.id);
    for (const edge of downstreamEdges) {
        setEdges(es => es.map(e => e.id === edge.id ? {...e, animated: true} : e));
        await processNode(edge.target, startValue, edge.targetHandle);
        setEdges(es => es.map(e => e.id === edge.id ? {...e, animated: false} : e));
    }
    
    announce('Workflow execution completed', 'polite');
    addToast({
      type: 'success',
      title: 'Workflow Completed',
      description: 'All agents have finished processing successfully.'
    });
    setWorkflowStatus('idle');
  };

  const processNode = async (nodeId: string, input: string, targetHandle?: string | null) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      updateNodeState(node.id, s => ({ status: 'running' }));

      let output: string | null = null;
      try {
        if (node.type === 'agentPanel' || node.type === 'collapsedAgent') {
            output = await handleAgentTask(node, input);
        } else if (node.type === 'combine' || node.type === 'collapsedCombine') {
            output = await handleCombineTask(node, input, targetHandle);
        }
        if(output !== null) {
            updateNodeState(node.id, s => ({ status: 'completed', lastOutput: output }));
            const downstreamEdges = edges.filter(e => e.source === nodeId);
            for (const edge of downstreamEdges) {
                setEdges(es => es.map(e => e.id === edge.id ? {...e, animated: true} : e));
                await processNode(edge.target, output, edge.targetHandle);
                setEdges(es => es.map(e => e.id === edge.id ? {...e, animated: false} : e));
            }
        }
      } catch (error) {
          console.error(`Error processing node ${nodeId}:`, error);
          updateNodeState(node.id, s => ({ status: 'error' }));
          addToast({
            type: 'error',
            title: 'Agent Error',
            description: `Failed to process ${node.data.agentState.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
      }
  };
  
  const handleAgentTask = async (node: Node<NodeData>, input: string): Promise<string | null> => {
    const { id, data: { agentState } } = node;
    const { userPromptTemplate } = agentState;
    const finalPrompt = userPromptTemplate.replace(/{{input}}/g, input);

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: finalPrompt, source: { agentId: 'workflow', agentName: 'Workflow' } };
    updateNodeState(id, s => ({ messages: [...s.messages, userMessage, { id: 'loading', role: 'assistant', content: '', isLoading: true }] }));
    
    let fullResponse = "";
    try {
      const stream = await sendMessageStream(id, finalPrompt, agentState, chatInstances);
      for await (const chunk of stream) {
        fullResponse += chunk;
        updateNodeState(id, s => {
            const newMessages = [...s.messages];
            const assistantMessage = newMessages[newMessages.length - 1];
            if (assistantMessage?.role === 'assistant') assistantMessage.content = fullResponse;
            return { messages: newMessages };
        });
      }
      
      updateNodeState(id, s => {
          const newMessages = [...s.messages];
          const assistantMessage = newMessages[newMessages.length - 1];
          if (assistantMessage?.role === 'assistant') {
            assistantMessage.isLoading = false;
            assistantMessage.id = Date.now().toString() + '-assistant';
          }
          return { messages: newMessages };
      });
      return fullResponse;
    } catch (error) {
       console.error("Error sending message:", error);
       updateNodeState(id, s => {
          const newMessages = [...s.messages];
          const assistantMessage = newMessages[newMessages.length - 1];
          if (assistantMessage?.role === 'assistant') {
            assistantMessage.content = `Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`;
            assistantMessage.isLoading = false;
            assistantMessage.isError = true;
          }
          return { messages: newMessages };
       });
       throw error;
    }
  };

  const handleCombineTask = async (node: Node<NodeData>, input: string, handleId?: string | null): Promise<string | null> => {
      const { id, data: { agentState } } = node;
      const handle = handleId || 'input_1';
      
      const receivedInputs = { ...(agentState.receivedInputs || {}), [handle]: input };
      updateNodeState(id, s => ({ receivedInputs }));
      
      const requiredInputs = edges.filter(e => e.target === id);
      const hasAllInputs = requiredInputs.every(h => Object.keys(receivedInputs).includes(h.targetHandle || 'input_1'));
      
      if(hasAllInputs) {
          let output = agentState.template || "";
          for(const [key, value] of Object.entries(receivedInputs)) {
              output = output.replace(new RegExp(`{{${key}}}`, 'g'), value);
          }
          updateNodeState(id, s => ({messages: [{id: 'output', role: 'assistant', content: output}]}));
          return output;
      }
      return null;
  }
  
  const resetWorkflowState = () => {
      setNodes(nds => nds.map(n => ({
          ...n,
          data: {
              ...n.data,
              agentState: {
                  ...n.data.agentState,
                  status: 'idle',
                  messages: n.type === 'start' ? n.data.agentState.messages : [],
                  receivedInputs: n.type === 'combine' || n.type === 'collapsedCombine' ? {} : n.data.agentState.receivedInputs,
              }
          }
      })))
  };

  const handleSaveWorkflow = () => {
    const serializableNodes = nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: { agentState: node.data.agentState }, // Only save serializable state
        style: node.style,
    }));
    const workflowData = { nodes: serializableNodes, edges };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(workflowData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "workflow.json";
    link.click();
  };

  const handleLoadWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const loadedData = JSON.parse(e.target?.result as string);
            if (loadedData.nodes && loadedData.edges) {
                const rehydratedNodes = loadedData.nodes.map((node: Node<any>) => ({
                    ...node,
                    data: {
                        ...node.data,
                        onStateChange: updateNodeStateField,
                        onClose: removeNode,
                        onToggleCollapse: toggleCollapseNode,
                        onSettingsOpen: (nodeId: string) => setEditingNode(nodes.find(n => n.id === nodeId) || null),
                    }
                }));
                setNodes(rehydratedNodes);
                setEdges(loadedData.edges);
            } else {
                alert("Invalid workflow file format.");
            }
        } catch (error) {
            console.error("Failed to load workflow:", error);
            alert("Failed to parse workflow file.");
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input to allow loading same file again
  };

  const onConnect = useCallback((params: Connection | ReactFlowEdge) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', style: { stroke: '#06b6d4', strokeWidth: 2 } }, eds)), [setEdges]);

  const nodeTypes = useMemo(() => ({
      agentPanel: AgentPanel,
      collapsedAgent: CollapsedAgentIcon,
      start: StartNode,
      combine: CombineNode,
      collapsedCombine: CollapsedCombineNode,
  }), []);
  
  return (
    <div className="w-screen h-screen overflow-hidden bg-neutral-950 relative flex flex-col">
       <ReactFlowProvider>
          <WorkflowControls onAddNode={addNode} onRun={executeWorkflow} onReset={resetWorkflowState} onSave={handleSaveWorkflow} onLoad={handleLoadWorkflow} isRunning={workflowStatus === 'running'} />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            className="bg-grid-primary-500/[0.1]"
            deleteKeyCode={['Backspace', 'Delete']}
          >
             <Background color="#404040" gap={16} />
             <Controls />
          </ReactFlow>
          {editingNode && <AgentSettingsModal node={editingNode} onStateChange={updateNodeStateField} onClose={() => setEditingNode(null)} />}
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </ReactFlowProvider>
    </div>
  );
};

const App: React.FC = () => {
          }
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;

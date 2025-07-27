import React, { memo, useMemo } from 'react';
import { Handle, Position, NodeProps, useEdges, useReactFlow } from 'reactflow';
import { NodeData, NodeStatus } from '../types';
import { IconCombine, IconMinimize, IconCheck, IconAlertTriangle, IconSparkles, IconX } from './Icons';
import MessageList from './MessageList';
import ResizeHandle from './ResizeHandle';

const statusStyles: Record<NodeStatus, string> = {
    idle: 'border-yellow-500/80',
    running: 'border-yellow-400/80 animate-pulse',
    completed: 'border-green-500/80',
    error: 'border-red-500/80',
};

const StatusIcon = ({ status }: { status: NodeStatus }) => {
    switch(status) {
        case 'running': return <IconSparkles className="w-5 h-5 text-yellow-400 animate-spin" />;
        case 'completed': return <IconCheck className="w-5 h-5 text-green-500" />;
        case 'error': return <IconAlertTriangle className="w-5 h-5 text-red-500" />;
        default: return <IconCombine className="w-5 h-5 text-yellow-500 shrink-0" />;
    }
};


const CombineNode: React.FC<NodeProps<NodeData>> = ({ id, data }) => {
    const { agentState, onStateChange, onClose, onToggleCollapse } = data;
    const { getEdges } = useReactFlow();
    
    const incomingHandles = useMemo(() => {
        const connectedHandles = getEdges()
            .filter(edge => edge.target === id)
            .map(edge => edge.targetHandle || 'input_1');
        const allHandles = new Set(connectedHandles);
        // Ensure there's at least one handle, and add a new potential handle
        if (allHandles.size === 0) {
            allHandles.add('input_1');
        } else {
            allHandles.add(`input_${allHandles.size + 1}`);
        }
        return Array.from(allHandles);
    }, [getEdges, id]);

    const accentColorStyle = { '--agent-accent-color': agentState.color } as React.CSSProperties;
    const borderClass = statusStyles[agentState.status] || statusStyles.idle;

    const handleContainerHeight = incomingHandles.length * 28;

    return (
        <div
            className={`flex flex-col bg-black/50 backdrop-blur-md border rounded-lg shadow-2xl shadow-yellow-500/10 nowheel transition-colors duration-300 ${borderClass}`}
            style={accentColorStyle}
        >
            <div className={`flex items-center justify-between p-2 border-b cursor-move ${borderClass}`}>
                 <div className="flex items-center gap-2">
                    <StatusIcon status={agentState.status} />
                    <span className="font-bold text-yellow-400">{agentState.name}</span>
                </div>
                <div className="flex items-center gap-1 nodrag">
                    <button onClick={() => onToggleCollapse(id, 'combine')} className="p-1 rounded-md hover:bg-yellow-500/20 transition-colors" title="Collapse Panel">
                        <IconMinimize className="w-5 h-5 text-gray-300 hover:text-white" />
                    </button>
                    <button onClick={() => onClose(id)} className="p-1 rounded-md hover:bg-red-500/50 transition-colors" title="Close Node">
                        <IconX className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto">
                 <label htmlFor={`template-text-${id}`} className="text-sm font-bold text-gray-300 mb-1 block">Output Template</label>
                <textarea
                    id={`template-text-${id}`}
                    value={agentState.template}
                    onChange={(e) => onStateChange(id, 'template', e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-y text-gray-200 font-mono text-sm"
                    rows={4}
                    placeholder="e.g. Analysis: {{input_1}}&#10;Summary: {{input_2}}"
                />
            </div>
            
            <div className="relative p-3 border-t border-yellow-500/30">
                 <h4 className="text-sm font-bold text-gray-300 mb-2">Inputs</h4>
                 <div className="relative" style={{ height: handleContainerHeight }}>
                    {incomingHandles.map((handleId, index) => (
                        <div key={handleId} className="absolute w-full" style={{ top: `${index * 28}px` }}>
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={handleId}
                                className="!bg-cyan-500 !w-3 !h-3 !-translate-y-1/2"
                                style={{ top: '12px' }}
                            />
                            <span className="ml-6 text-sm text-gray-400 font-mono">{handleId}</span>
                        </div>
                    ))}
                 </div>
            </div>

            {agentState.messages && agentState.messages.length > 0 && (
                <div className="p-3 border-t border-yellow-500/30 overflow-y-auto">
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Last Output</h4>
                    <MessageList messages={agentState.messages} />
                </div>
            )}
            
            <ResizeHandle onResize={(width, height) => onStateChange(id, 'size', { width, height })} />

            <Handle type="source" position={Position.Right} className="!bg-orange-500 !w-3 !h-3" />
        </div>
    );
};

export default memo(CombineNode);
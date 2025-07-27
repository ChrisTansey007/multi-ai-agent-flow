import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, NodeStatus } from '../types';
import { IconCombine, IconCheck, IconAlertTriangle, IconSparkles } from './Icons';

const statusStyles: Record<NodeStatus, string> = {
    idle: 'border-yellow-500/80',
    running: 'border-yellow-400/80 animate-pulse',
    completed: 'border-green-500/80',
    error: 'border-red-500/80',
};

const StatusIcon = ({ status }: { status: NodeStatus }) => {
    switch(status) {
        case 'running': return <IconSparkles className="w-8 h-8 text-yellow-400 animate-spin" />;
        case 'completed': return <IconCheck className="w-8 h-8 text-green-500" />;
        case 'error': return <IconAlertTriangle className="w-8 h-8 text-red-500" />;
        default: return <IconCombine className="w-8 h-8 text-yellow-400" />;
    }
};

const CollapsedCombineNode: React.FC<NodeProps<NodeData>> = ({ id, data }) => {
    const { agentState, onToggleCollapse } = data;
    const accentColorStyle = { '--agent-accent-color': agentState.color } as React.CSSProperties;
    const borderClass = statusStyles[agentState.status] || statusStyles.idle;

    const title = `${agentState.name} (Status: ${agentState.status}) - Double-click to expand`;

    return (
        <div
            style={accentColorStyle}
            className={`agent-icon w-20 h-20 rounded-lg bg-black/60 backdrop-blur-md border-2 flex items-center justify-center cursor-move group nowheel transition-colors duration-300 ${borderClass}`}
            title={title}
            onDoubleClick={() => onToggleCollapse(id, 'combine')}
        >
             <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-2 !h-2 !-ml-1" />
            
            <div
                className="w-16 h-16 rounded-md bg-yellow-500/20 flex items-center justify-center"
            >
                <StatusIcon status={agentState.status} />
            </div>

            <Handle type="source" position={Position.Right} className="!bg-orange-500 !w-2 !h-2 !-mr-1" />
        </div>
    );
};

export default memo(CollapsedCombineNode);

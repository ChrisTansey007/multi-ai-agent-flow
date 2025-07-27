
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '../types';
import { IconPlay } from './Icons';

const StartNode: React.FC<NodeProps<NodeData>> = ({ id, data }) => {
    const { agentState, onStateChange } = data;
    const accentColorStyle = { '--agent-accent-color': agentState.color } as React.CSSProperties;

    return (
        <div
            className="bg-black/50 backdrop-blur-md border border-green-500/80 rounded-lg shadow-2xl shadow-green-500/10 nowheel w-80"
            style={accentColorStyle}
        >
            <div className="flex items-center gap-2 p-2 border-b border-green-500/80 cursor-move">
                <IconPlay className="w-5 h-5 text-green-500 shrink-0" />
                <span className="font-bold text-green-400">{agentState.name}</span>
            </div>
            <div className="p-3">
                <label htmlFor={`start-text-${id}`} className="text-sm font-bold text-gray-300 mb-1 block">Initial Prompt</label>
                <textarea
                    id={`start-text-${id}`}
                    value={agentState.startValue}
                    onChange={(e) => onStateChange(id, 'startValue', e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y text-gray-200"
                    rows={4}
                />
            </div>
            <Handle type="source" position={Position.Right} className="!bg-orange-500 !w-3 !h-3" />
        </div>
    );
};

export default memo(StartNode);

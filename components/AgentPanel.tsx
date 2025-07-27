import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, NodeStatus } from '../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSwitcher from './ModelSwitcher';
import ResizeHandle from './ResizeHandle';
import { IconX, IconArrowsMove, IconMinimize, IconCheck, IconAlertTriangle, IconSparkles, IconSettings } from './Icons';

const statusStyles: Record<NodeStatus, string> = {
    idle: 'border-[var(--agent-accent-color)]/30',
    running: 'border-yellow-400/80 animate-pulse',
    completed: 'border-green-500/80',
    error: 'border-red-500/80',
};

const StatusIcon = ({ status }: { status: NodeStatus }) => {
    switch(status) {
        case 'running': return <IconSparkles className="w-5 h-5 text-yellow-400 animate-spin" />;
        case 'completed': return <IconCheck className="w-5 h-5 text-green-500" />;
        case 'error': return <IconAlertTriangle className="w-5 h-5 text-red-500" />;
        default: return <IconArrowsMove className="w-5 h-5 text-[var(--agent-accent-color)]/50 shrink-0" />;
    }
};

const AgentPanel: React.FC<NodeProps<NodeData>> = ({ id, data }) => {
  const { agentState, onStateChange, onClose, onToggleCollapse, onSettingsOpen } = data;
  const [isEditingName, setIsEditingName] = useState(false);
  
  const accentColorStyle = { '--agent-accent-color': agentState.color } as React.CSSProperties;
  const borderClass = statusStyles[agentState.status] || statusStyles.idle;

  return (
    <div
      className={`agent-panel flex flex-col bg-black/50 backdrop-blur-md border rounded-lg shadow-2xl shadow-[var(--agent-accent-color)]/10 nowheel transition-colors duration-300 ${borderClass}`}
      style={accentColorStyle}
    >
      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-3 !h-3" />
      
      <div className={`flex items-center justify-between p-2 border-b cursor-move ${borderClass}`}>
        <div className="flex items-center gap-2 flex-shrink min-w-0">
          <StatusIcon status={agentState.status} />
          {isEditingName ? (
            <input
              type="text"
              value={agentState.name}
              onChange={(e) => onStateChange(id, 'name', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
              onBlur={() => setIsEditingName(false)}
              className="nodrag bg-transparent border-b border-[var(--agent-accent-color)]/50 text-[var(--agent-accent-color)] font-bold focus:outline-none"
            />
          ) : (
            <span 
              onDoubleClick={() => setIsEditingName(true)} 
              className="font-bold text-[var(--agent-accent-color)] select-none truncate"
              title="Double-click to rename"
            >
              {agentState.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 nodrag">
          <ModelSwitcher
            currentModel={agentState.model}
            onModelChange={(newModel) => onStateChange(id, 'model', newModel)}
            accentColor={agentState.color}
          />
           <button onClick={() => onSettingsOpen(id)} className="p-1 rounded-md hover:bg-[var(--agent-accent-color)]/20 transition-colors" title="Agent Settings">
            <IconSettings className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
          <button onClick={() => onToggleCollapse(id, 'agentPanel')} className="p-1 rounded-md hover:bg-[var(--agent-accent-color)]/20 transition-colors" title="Collapse Panel">
            <IconMinimize className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
          <button onClick={() => onClose(id)} className="p-1 rounded-md hover:bg-red-500/50 transition-colors" title="Close Agent">
            <IconX className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList 
            messages={agentState.messages}
        />
        <div className={agentState.status === 'running' ? 'opacity-50 pointer-events-none' : ''}>
           <MessageInput onSendMessage={() => { /* Manual sending disabled in workflow mode */ }} />
        </div>
      </div>

      <ResizeHandle onResize={(width, height) => onStateChange(id, 'size', { width, height })} />

      <Handle type="source" position={Position.Right} className="!bg-orange-500 !w-3 !h-3" />
    </div>
  );
};

export default memo(AgentPanel);
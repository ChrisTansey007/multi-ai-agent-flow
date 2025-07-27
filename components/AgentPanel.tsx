import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, NodeStatus } from '../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ModelSwitcher from './ModelSwitcher';
import ResizeHandle from './ResizeHandle';
import { IconX, IconArrowsMove, IconMinimize, IconCheck, IconAlertTriangle, IconSparkles, IconSettings } from './Icons';

const statusStyles: Record<NodeStatus, string> = {
    idle: 'border-[var(--agent-accent-color)]/40',
    running: 'border-warning-400/80 animate-pulse shadow-glow',
    completed: 'border-success-500/80 shadow-success-500/20',
    error: 'border-error-500/80 shadow-error-500/20',
};

const StatusIcon = ({ status }: { status: NodeStatus }) => {
    switch(status) {
        case 'running': return <IconSparkles className="w-5 h-5 text-warning-400 animate-spin" />;
        case 'completed': return <IconCheck className="w-5 h-5 text-success-500" />;
        case 'error': return <IconAlertTriangle className="w-5 h-5 text-error-500" />;
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
      className={`agent-panel flex flex-col bg-neutral-950/80 backdrop-blur-md border rounded-xl shadow-2xl shadow-[var(--agent-accent-color)]/10 nowheel transition-all duration-300 ${borderClass}`}
      style={accentColorStyle}
      role="region"
      aria-label={`Agent panel: ${agentState.name}`}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-secondary-500 !w-3 !h-3 !border-2 !border-neutral-700" 
        aria-label="Input connection point"
      />
      
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
              className="nodrag bg-transparent border-b border-[var(--agent-accent-color)]/50 text-[var(--agent-accent-color)] font-bold focus:outline-none focus:border-[var(--agent-accent-color)]"
              autoFocus
              aria-label="Agent name"
              maxLength={50}
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
           <button 
             onClick={() => onSettingsOpen(id)} 
             className="p-1.5 rounded-md hover:bg-[var(--agent-accent-color)]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--agent-accent-color)]/50" 
             title="Agent Settings"
             aria-label="Open agent settings"
           >
            <IconSettings className="w-4 h-4 text-neutral-400 hover:text-neutral-200" />
          </button>
          <button onClick={() => onToggleCollapse(id, 'agentPanel')} className="p-1.5 rounded-md hover:bg-[var(--agent-accent-color)]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--agent-accent-color)]/50" title="Collapse Panel" aria-label="Collapse panel">
            <IconMinimize className="w-4 h-4 text-neutral-400 hover:text-neutral-200" />
          </button>
          <button onClick={() => onClose(id)} className="p-1.5 rounded-md hover:bg-error-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-error-500/50" title="Close Agent" aria-label="Close agent">
            <IconX className="w-4 h-4 text-neutral-400 hover:text-error-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden" role="main" aria-label="Agent conversation">
        <MessageList 
            messages={agentState.messages}
        />
        <div className={agentState.status === 'running' ? 'opacity-50 pointer-events-none' : ''}>
           <MessageInput onSendMessage={() => { /* Manual sending disabled in workflow mode */ }} />
        </div>
      </div>

      <ResizeHandle onResize={(width, height) => onStateChange(id, 'size', { width, height })} />

      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-warning-500 !w-3 !h-3 !border-2 !border-neutral-700" 
        aria-label="Output connection point"
      />
    </div>
  );
};

export default memo(AgentPanel);
import React, { useState, useRef } from 'react';
import { IconPlay, IconRefresh, IconPlus } from './Icons';
import { NodeType } from '../types';

interface WorkflowControlsProps {
  onAddNode: (type: NodeType) => void;
  onRun: () => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRunning: boolean;
}

const WorkflowControls: React.FC<WorkflowControlsProps> = ({ onAddNode, onRun, onReset, onSave, onLoad, isRunning }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLoadClick = () => {
        fileInputRef.current?.click();
    };

  return (
    <header className="absolute top-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-700/50 p-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary-400 tracking-wider">NEXUS AI WORKFLOW</h1>
        <div className="h-6 w-px bg-primary-500/30"></div>
        <div className="flex items-center gap-2">
            <button 
                onClick={onRun}
                disabled={isRunning}
                className="flex items-center gap-2 bg-success-600 hover:bg-success-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:bg-neutral-600 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                aria-label={isRunning ? 'Workflow is running' : 'Run workflow'}
            >
                <IconPlay className="w-5 h-5" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
             <button 
                onClick={onReset}
                disabled={isRunning}
                className="flex items-center gap-2 bg-warning-600 hover:bg-warning-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:bg-neutral-600 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-warning-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                aria-label="Reset workflow"
            >
                <IconRefresh className="w-5 h-5" />
                <span>Reset</span>
            </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <button 
           onClick={onSave} 
           className="px-4 py-2.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
           aria-label="Save workflow"
         >
           Save
         </button>
         <button 
           onClick={handleLoadClick} 
           className="px-4 py-2.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
           aria-label="Load workflow"
         >
           Load
         </button>
         <input type="file" ref={fileInputRef} onChange={onLoad} accept=".json" className="hidden" />

        <div className="relative">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                aria-label="Add new node"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
            >
                <IconPlus className="w-5 h-5" />
                <span>Add Node</span>
            </button>
            {isMenuOpen && (
                <div 
                  onMouseLeave={() => setIsMenuOpen(false)} 
                  className="absolute top-full right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl py-2 backdrop-blur-sm"
                  role="menu"
                  aria-orientation="vertical"
                >
                    <button 
                      onClick={() => { onAddNode('start'); setIsMenuOpen(false); }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-neutral-200 hover:bg-primary-500/20 hover:text-primary-300 transition-colors focus:outline-none focus:bg-primary-500/20"
                      role="menuitem"
                    >
                      Start Node
                    </button>
                    <button 
                      onClick={() => { onAddNode('agentPanel'); setIsMenuOpen(false); }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-neutral-200 hover:bg-primary-500/20 hover:text-primary-300 transition-colors focus:outline-none focus:bg-primary-500/20"
                      role="menuitem"
                    >
                      Agent Node
                    </button>
                    <button 
                      onClick={() => { onAddNode('combine'); setIsMenuOpen(false); }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-neutral-200 hover:bg-primary-500/20 hover:text-primary-300 transition-colors focus:outline-none focus:bg-primary-500/20"
                      role="menuitem"
                    >
                      Combine Node
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default WorkflowControls;
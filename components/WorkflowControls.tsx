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
    <header className="absolute top-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-b border-cyan-500/30 p-2 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-cyan-400 tracking-wider">NEXUS AI WORKFLOW</h1>
        <div className="h-6 w-px bg-cyan-500/30"></div>
        <div className="flex items-center gap-2">
            <button 
                onClick={onRun}
                disabled={isRunning}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                <IconPlay className="w-5 h-5" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
             <button 
                onClick={onReset}
                disabled={isRunning}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                <IconRefresh className="w-5 h-5" />
                <span>Reset</span>
            </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <button onClick={onSave} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors text-sm">Save</button>
         <button onClick={handleLoadClick} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors text-sm">Load</button>
         <input type="file" ref={fileInputRef} onChange={onLoad} accept=".json" className="hidden" />

        <div className="relative">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition-colors"
            >
                <IconPlus className="w-5 h-5" />
                <span>Add Node</span>
            </button>
            {isMenuOpen && (
                <div onMouseLeave={() => setIsMenuOpen(false)} className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-cyan-500/30 rounded-md shadow-lg py-1">
                    <button onClick={() => { onAddNode('start'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-cyan-500/20 block">Start Node</button>
                    <button onClick={() => { onAddNode('agentPanel'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-cyan-500/20 block">Agent Node</button>
                    <button onClick={() => { onAddNode('combine'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-cyan-500/20 block">Combine Node</button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default WorkflowControls;
import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { AgentState, NodeData } from '../types';
import { IconX } from './Icons';
import ModelSwitcher from './ModelSwitcher';

interface AgentSettingsModalProps {
    node: Node<NodeData>;
    onStateChange: <K extends keyof AgentState>(id: string, key: K, value: AgentState[K]) => void;
    onClose: () => void;
}

const AgentSettingsModal: React.FC<AgentSettingsModalProps> = ({ node, onStateChange, onClose }) => {
    const { id, data: { agentState } } = node;
    const [localName, setLocalName] = useState(agentState.name);
    const [localSystemPrompt, setLocalSystemPrompt] = useState(agentState.systemPrompt);
    const [localUserPrompt, setLocalUserPrompt] = useState(agentState.userPromptTemplate);
    const [localModel, setLocalModel] = useState(agentState.model);

    useEffect(() => {
        setLocalName(agentState.name);
        setLocalSystemPrompt(agentState.systemPrompt);
        setLocalUserPrompt(agentState.userPromptTemplate);
        setLocalModel(agentState.model);
    }, [agentState]);

    const handleSave = () => {
        onStateChange(id, 'name', localName);
        onStateChange(id, 'systemPrompt', localSystemPrompt);
        onStateChange(id, 'userPromptTemplate', localUserPrompt);
        onStateChange(id, 'model', localModel);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-cyan-500/30">
                    <h2 className="text-lg font-bold text-cyan-400">Settings for {agentState.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-red-500/50 transition-colors">
                        <IconX className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    <div>
                        <label htmlFor="agent-name" className="block text-sm font-medium text-gray-300 mb-1">Agent Name</label>
                        <input
                            id="agent-name"
                            type="text"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="agent-model" className="block text-sm font-medium text-gray-300 mb-1">AI Model</label>
                        <ModelSwitcher currentModel={localModel} onModelChange={setLocalModel} accentColor={agentState.color} />
                    </div>

                    <div>
                        <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-300 mb-1">System Prompt</label>
                        <p className="text-xs text-gray-500 mb-2">Define the agent's personality, instructions, and constraints.</p>
                        <textarea
                            id="system-prompt"
                            value={localSystemPrompt}
                            onChange={(e) => setLocalSystemPrompt(e.target.value)}
                            rows={6}
                            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="user-prompt" className="block text-sm font-medium text-gray-300 mb-1">User Prompt Template</label>
                        <p className="text-xs text-gray-500 mb-2">Template for how this agent receives input from other nodes. Use <code className="text-cyan-400 bg-gray-700 px-1 rounded-sm">{'{{input}}'}</code> as the placeholder.</p>
                        <textarea
                            id="user-prompt"
                            value={localUserPrompt}
                            onChange={(e) => setLocalUserPrompt(e.target.value)}
                            rows={4}
                             className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-cyan-500/30 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default AgentSettingsModal;

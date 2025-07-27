export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  isLoading?: boolean;
  isError?: boolean;
  source?: {
    agentId: string;
    agentName: string;
  };
}

export type Model = string; // e.g., 'gemini-2.5-flash', 'openai/gpt-4o'
export type NodeType = 'agentPanel' | 'collapsedAgent' | 'start' | 'combine' | 'collapsedCombine';
export type NodeStatus = 'idle' | 'running' | 'completed' | 'error';


export interface AgentState {
  id: string;
  name: string;
  size: { width: number; height: number };
  model: Model;
  messages: Message[];
  isCollapsed: boolean;
  color: string;
  // Prompt Engineering
  systemPrompt: string;
  userPromptTemplate: string;
  // Workflow properties
  status: NodeStatus;
  lastOutput?: string | null;
  // Combine node specific
  template?: string;
  receivedInputs?: Record<string, string>;
  // Start node specific
  startValue?: string;
}

// Data payload for React Flow nodes
export interface NodeData {
    agentState: AgentState;
    onStateChange: <K extends keyof AgentState>(id: string, key: K, value: AgentState[K]) => void;
    onClose: (agentId: string) => void;
    onToggleCollapse: (agentId: string, type: 'agentPanel' | 'combine') => void;
    onSettingsOpen: (agentId: string) => void;
}
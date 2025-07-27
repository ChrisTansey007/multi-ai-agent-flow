
# Architecture Overview

This application is a futuristic AI-powered chat interface built with React + TypeScript, styled with Tailwind CSS, and designed for multi-agent interactions.

## Key Systems:

*   **Frontend UI**: React (Functional Components with Hooks), TypeScript, Tailwind CSS for styling.
*   **Agent Workspace Manager**: Built using `react-flow`, this handles the layout, connections, and interactions (drag, pan, zoom) between all agent nodes.
*   **Custom Nodes**: The `AgentPanel` and `CollapsedAgentIcon` are custom `react-flow` nodes, preserving the application's unique look and feel.
*   **Backend API Integration**: Service layer to communicate with the Gemini API for generative AI capabilities.

## Communication Flow:

User Message → Custom Node (`AgentPanel`) → Gemini Service → Gemini API → Streaming Response → UI Render.
Agent-to-Agent communication is handled via `react-flow` edges, triggering new messages automatically.

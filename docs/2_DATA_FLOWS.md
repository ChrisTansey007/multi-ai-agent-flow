
# State and Data Flow

*   **Canvas State** (`react-flow` Hooks): The primary state for the agent workspace is managed by `useNodesState` and `useEdgesState`. The `nodes` array is the single source of truth, with each node's `data` property containing the full `AgentState` (messages, color, etc.).
*   **Remote State**: Manages streaming message responses from the Gemini API.
*   **Key Flows**:
    *   A message is sent from the UI. The state is updated via `setNodes`, modifying the `messages` array for the specific node. The UI re-renders optimistically.
    *   An API call is dispatched to the Gemini service.
    *   The response is streamed back, and the node's data is continuously updated with the new text.
    *   **Chaining**: When a response is complete, the application checks for any outgoing edges from that node and automatically routes the response as a new prompt to the connected target node(s).

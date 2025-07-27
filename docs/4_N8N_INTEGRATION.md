
# Gemini API Integration (formerly n8n)

*   **Service Layer**: `services/geminiService.ts`
*   **API Client**: Uses `@google/genai`.
*   **Functionality**:
    *   `sendMessageStream`: Primary function to send a user message and receive a streaming response.
    *   `Chat` instances are managed per-agent to maintain conversation history.
*   **Authentication**: An API key is passed via the `process.env.API_KEY` environment variable.

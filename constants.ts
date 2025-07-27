export const MODEL_PROVIDERS = [
    {
        name: 'Google Gemini',
        models: [
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', disabled: false },
        ]
    },
    {
        name: 'OpenAI',
        models: [
            { id: 'openai/gpt-4o', name: 'GPT-4o', disabled: true },
            { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', disabled: true },
            { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', disabled: true },
        ]
    },
    {
        name: 'Anthropic',
        models: [
            { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', disabled: true },
            { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', disabled: true },
            { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', disabled: true },
        ]
    },
    {
        name: 'Mistral / OpenRouter',
        models: [
            { id: 'mistral/mistral-large', name: 'Mistral Large', disabled: true },
            { id: 'mistral/mixtral-8x22b', name: 'Mixtral 8x22B', disabled: true },
        ]
    }
];

// A palette of vibrant, yet harmonious colors for agent theming.
export const AGENT_COLORS = [
    '#3b82f6', // primary-500
    '#22c55e', // success-500  
    '#f97316', // orange-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
    '#14b8a6', // secondary-500
    '#f59e0b', // warning-500
    '#ef4444', // error-500
];
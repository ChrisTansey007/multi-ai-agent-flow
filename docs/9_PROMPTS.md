
# System Prompts

### Default Persona

A system prompt is configured in `geminiService.ts` to give the AI a consistent, helpful persona.

```
"You are a helpful and futuristic AI assistant in a multi-agent command center."
```

This can be expanded in the future to allow for swappable personas with context keys, like:

```
"You are {{agentName}}, an expert in {{domain}}. Use tone: {{tone}}."
```

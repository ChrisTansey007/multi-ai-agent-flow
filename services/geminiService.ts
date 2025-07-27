import React from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { AgentState } from '../types';

if (!process.env.API_KEY) {
  console.warn(
    "API_KEY environment variable not set. Application will not be able to connect to Gemini."
  );
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
// Store not just the chat, but the system prompt it was created with.
const chatCache = new Map<string, { chat: Chat; systemInstruction: string }>();


function getOrCreateChat(
    agentId: string,
    systemInstruction: string,
    model: string, // e.g. gemini-2.5-flash
    chatInstances: React.MutableRefObject<Map<string, { chat: Chat; systemInstruction: string }>>
): Chat {
  const cached = chatInstances.current.get(agentId);

  // If a chat exists and the system prompt is the same, reuse it.
  if (cached && cached.systemInstruction === systemInstruction) {
    return cached.chat;
  }
  
  // Otherwise, create a new chat instance.
  console.log(`Creating new chat for ${agentId} with new system prompt.`);
  const newChat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
    }
  });

  chatInstances.current.set(agentId, { chat: newChat, systemInstruction });
  return newChat;
}

export async function* sendMessageStream(
  agentId: string,
  message: string,
  agentState: AgentState,
  chatInstances: React.MutableRefObject<Map<string, { chat: Chat; systemInstruction: string }>>
): AsyncGenerator<string, void, undefined> {

  if (!process.env.API_KEY) {
    throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
  }
    
  const chat = getOrCreateChat(agentId, agentState.systemPrompt, agentState.model, chatInstances);

  try {
    const stream = await chat.sendMessageStream({ message });
    for await (const chunk of stream) {
      yield chunk.text;
    }
  } catch(e) {
    console.error(`[Gemini Service Error] for agent ${agentId}:`, e);
    throw new Error("Failed to get response from AI. Check console for details.");
  }
}
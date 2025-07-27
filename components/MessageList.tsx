import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { IconUser, IconSparkles } from './Icons';

interface MessageListProps {
  messages: Message[];
}

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`group flex items-start gap-3 p-4 relative ${isAssistant ? 'bg-[var(--agent-accent-color)]/5' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAssistant ? 'bg-[var(--agent-accent-color)]/20 text-[var(--agent-accent-color)]' : 'bg-gray-600'}`}>
        {isAssistant ? <IconSparkles className="w-5 h-5" /> : <IconUser className="w-5 h-5" />}
      </div>
      <div className="flex-1 pt-1 text-gray-200 min-w-0">
         {message.source && (
            <div className="text-xs text-gray-400 mb-1.5 italic">Input from {message.source.agentName}</div>
        )}
        <pre className="whitespace-pre-wrap font-sans break-words">
          {message.content}
          {message.isLoading && <span className="inline-block w-2 h-4 ml-2 bg-[var(--agent-accent-color)] animate-pulse" />}
        </pre>
        {message.isError && (
             <p className="text-red-400 text-sm mt-2">Could not get response from AI.</p>
        )}
      </div>
    </div>
  );
};


const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, messages[messages.length - 1]?.content]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="flex flex-col">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
};

export default MessageList;
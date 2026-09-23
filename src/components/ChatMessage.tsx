'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2, Paperclip, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useChatContext } from '@/lib/chat-context';
import { getAgent, AGENTS } from '@/lib/agents';
import type { Message, AgentId } from '@/types';

export default function ChatMessage({ 
  message, 
  currentPaneId 
}: { 
  message: Message; 
  currentPaneId?: string;
}) {
  const { settings, handoffMessage } = useChatContext();
  const isDark = settings.theme === 'dark';
  const isUser = message.role === 'user';
  const agent = getAgent(message.agentId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);

  const handleCopy = (text: string, id: string = 'all') => {
    navigator.clipboard.writeText(text);
    if (id === 'all') {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } else {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        const codeId = `code-${index}`;
        
        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-[#21242e] bg-[#090a0d] text-gray-200">
            <div className="flex justify-between items-center px-4 py-1.5 bg-[#14161d] text-[11px] font-mono border-b border-[#21242e]">
              <span className="text-gray-400 font-semibold">{language || 'code'}</span>
              <button 
                onClick={() => handleCopy(code, codeId)}
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
              >
                {copiedId === codeId ? <Check size={12} className="text-[#0284c7]" /> : <Copy size={12} />}
                <span>{copiedId === codeId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      // Inline markdown: bold, code, lists
      let html = part
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code class="bg-[#1c1e27] text-[#e2e4e9] px-1.5 py-0.5 rounded text-xs font-mono border border-[#2d313e]">$1</code>')
        .replace(/^- (.*)$/gm, '<li class="ml-4 list-disc">$1</li>');
        
      if (html.includes('<li')) {
        html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-2 space-y-1">$&</ul>');
      }

      return (
        <div 
          key={index} 
          className="whitespace-pre-wrap break-words leading-relaxed text-xs"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    });
  };

  return (
    <div className={`flex w-full animate-fade-in mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && agent && (
        <div className="flex-shrink-0 mr-3 mt-0.5 text-xl h-7 w-7 flex items-center justify-center">
          {agent.icon}
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
        {/* User Attached Files Badge */}
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {message.attachments.map(att => (
              <div 
                key={att.id} 
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#14161d] border border-[#21242e] text-[10px] text-gray-300 font-mono"
              >
                <Paperclip size={10} className="text-[#0284c7]" />
                <span className="truncate max-w-[130px]">{att.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Bubble - Antigravity Style */}
        <div 
          className={`px-4 py-3 text-xs ${
            isUser 
              ? 'bg-[#1c1e27] border border-[#2d313e] text-white rounded-2xl rounded-br-sm shadow-sm' 
              : `${isDark ? 'bg-[#14161d] border border-[#21242e]' : 'bg-white border border-gray-200'} ${isDark ? 'text-[#ededed]' : 'text-gray-800'} rounded-2xl rounded-bl-sm shadow-sm`
          }`}
        >
          {renderContent(message.content)}
        </div>
        
        {/* Meta & Antigravity Style Action Bar */}
        <div className="flex items-center space-x-2.5 mt-1 px-1 text-[10px] text-gray-500">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {!isUser && message.modelUsed && (
            <span className="px-1.5 py-0.2 rounded bg-[#1d2029] text-gray-300 font-mono border border-[#21242e]">
              {message.modelUsed}
            </span>
          )}

          {!isUser && (
            <>
              <button 
                onClick={() => handleCopy(message.content)}
                className="flex items-center space-x-1 hover:text-white transition-colors"
                title="Copy response"
              >
                {copiedAll ? <Check size={11} className="text-[#0284c7]" /> : <Copy size={11} />}
              </button>

              {/* Inter-Agent Handoff */}
              <div className="relative">
                <button
                  onClick={() => setShowHandoff(!showHandoff)}
                  className="flex items-center space-x-1 hover:text-[#0284c7] transition-colors"
                  title="Handoff output to another agent"
                >
                  <Share2 size={11} />
                  <span>Send to...</span>
                </button>

                {showHandoff && (
                  <div className={`absolute bottom-full left-0 mb-1 w-44 rounded-xl shadow-2xl z-50 border p-1 ${
                    isDark ? 'bg-[#14161d] border-[#21242e]' : 'bg-white border-gray-200'
                  }`}>
                    <div className="text-[9px] uppercase font-bold text-gray-500 px-2 py-1">Handoff to Agent:</div>
                    {AGENTS.filter(a => a.id !== message.agentId).map(target => (
                      <button
                        key={target.id}
                        onClick={() => {
                          handoffMessage(message.content, target.id as AgentId);
                          setShowHandoff(false);
                        }}
                        className={`flex items-center w-full px-2 py-1.5 rounded-lg text-xs text-left transition-colors ${
                          isDark ? 'hover:bg-[#1d2029] text-gray-200' : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <span className="mr-2 text-sm">{target.icon}</span>
                        <span>{target.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Feedback Thumbs */}
              <button className="hover:text-white transition-colors" title="Helpful">
                <ThumbsUp size={11} />
              </button>
              <button className="hover:text-white transition-colors" title="Not helpful">
                <ThumbsDown size={11} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

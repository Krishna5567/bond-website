'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  ArrowUp, 
  RotateCcw, 
  ChevronDown, 
  Paperclip, 
  X, 
  Plus, 
  Mic, 
  Cpu, 
  Sparkles,
  ChevronUp
} from 'lucide-react';
import { useChatContext } from '@/lib/chat-context';
import { AGENTS, getAgent } from '@/lib/agents';
import ChatMessage from './ChatMessage';
import type { PaneState, AgentId } from '@/types';

export default function AgentPane({ pane }: { pane: PaneState }) {
  const { 
    updatePaneInput, 
    sendMessage, 
    clearMessages, 
    switchAgent, 
    settings, 
    addAttachment, 
    removeAttachment,
    setPaneModel,
  } = useChatContext();

  const agent = getAgent(pane.agentId) || AGENTS[0];
  const isDark = settings.theme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [customModelInput, setCustomModelInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Active model for this pane
  const currentModel = pane.modelOverride || settings.models[agent.apiKeyName] || agent.defaultModel;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pane.messages, pane.isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((pane.input.trim() || (pane.attachments && pane.attachments.length > 0)) && !pane.isLoading) {
        sendMessage(pane.id);
      }
    }
  };

  const handleSuggestionClick = (text: string) => {
    updatePaneInput(pane.id, text);
    setTimeout(() => {
      sendMessage(pane.id);
    }, 50);
  };

  // Handle file uploads
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = '';
      const isImage = file.type.startsWith('image/');

      if (isImage) {
        content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else {
        try {
          content = await file.text();
        } catch (_) {
          content = `[Binary file: ${file.name}]`;
        }
      }

      addAttachment(pane.id, {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        content,
        isImage,
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = '';
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else {
        try {
          content = await file.text();
        } catch (_) {
          content = `[Binary file: ${file.name}]`;
        }
      }

      addAttachment(pane.id, {
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        content,
        isImage,
      });
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col h-full w-full ${isDark ? 'bg-[#0d0e12]' : 'bg-[#fafafa]'}`}
    >
      {/* Drag & drop overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-40 bg-[#0284c7]/15 border-2 border-dashed border-[#0284c7] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#14161d] border border-[#21242e] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 text-white">
            <Paperclip className="text-[#0284c7]" size={20} />
            <span className="font-medium text-sm">Drop files here to attach to {agent.name}</span>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />

      {/* Pane Sub-Header */}
      <div className={`flex items-center justify-between px-5 py-2.5 border-b select-none ${
        isDark ? 'border-[#21242e] bg-[#0d0e12]' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center space-x-2">
          {/* Agent Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowAgentDropdown(!showAgentDropdown);
                setShowModelDropdown(false);
              }}
              className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-colors ${
                isDark ? 'hover:bg-[#1d2029]' : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{agent.icon}</span>
              <span className={`font-semibold text-xs ${isDark ? 'text-[#ededed]' : 'text-gray-800'}`}>
                {agent.name}
              </span>
              <ChevronDown size={13} className="text-gray-500" />
            </button>

            {showAgentDropdown && (
              <div className={`absolute top-full left-0 mt-1 w-56 rounded-2xl shadow-2xl z-50 border p-1 ${
                isDark ? 'bg-[#14161d] border-[#21242e]' : 'bg-white border-gray-200'
              }`}>
                {AGENTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      switchAgent(pane.id, a.id as AgentId);
                      setShowAgentDropdown(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-xl text-left transition-colors ${
                      isDark ? 'hover:bg-[#1d2029]' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2.5 text-lg">{a.icon}</span>
                    <div>
                      <div className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{a.name}</div>
                      <div className="text-[10px] text-gray-500">{a.provider}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clear Messages */}
        <button 
          onClick={() => clearMessages(pane.id)}
          className={`p-1.5 rounded-lg transition-colors ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-[#1d2029]' : 'text-gray-500 hover:text-black hover:bg-gray-200'
          }`}
          title="Clear chat"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col space-y-4">
        {pane.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center space-y-4">
            <div className="text-5xl">{agent.icon}</div>
            <div>
              <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {agent.name} Workspace
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{agent.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 w-full max-w-md mt-2">
              {[
                'Refactor this component for maximum performance',
                'Analyze the attached code file for bugs and security risks',
                'Write complete unit tests with edge cases',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                    isDark 
                      ? 'bg-[#14161d] border-[#21242e] hover:border-[#2d313d] text-gray-300 hover:text-white' 
                      : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {pane.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} currentPaneId={pane.id} />
            ))}
            {pane.isLoading && (
              <div className="flex items-center space-x-2 p-3 rounded-2xl bg-[#14161d] border border-[#21242e] w-fit">
                <div className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="text-xs text-gray-400 font-mono ml-2">Thinking with {currentModel}...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Prompt Box - Exact Antigravity style in screenshot */}
      <div className="px-6 pb-5 pt-1">
        <div className={`relative rounded-2xl border transition-all shadow-xl ${
          isDark ? 'bg-[#14161d] border-[#21242e] focus-within:border-[#2d313d]' : 'bg-white border-gray-300 focus-within:border-gray-400'
        }`}>
          {/* Attached Files Pills */}
          {pane.attachments && pane.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-3 pb-0">
              {pane.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0d0e12] border border-[#21242e] text-xs text-gray-300"
                >
                  <Paperclip size={11} className="text-[#0284c7]" />
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">({Math.round(file.size / 1024)}kb)</span>
                  <button
                    onClick={() => removeAttachment(pane.id, file.id)}
                    className="p-0.5 hover:text-red-400 rounded"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Prompt Textarea */}
          <textarea
            value={pane.input}
            onChange={(e) => updatePaneInput(pane.id, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything, @ to mention, / for actions"
            className={`w-full max-h-36 resize-none rounded-t-2xl pt-3.5 pb-2 px-4 text-xs outline-none bg-transparent ${
              isDark ? 'text-[#ededed] placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
            }`}
            rows={pane.input.split('\n').length > 5 ? 5 : pane.input.split('\n').length || 1}
          />

          {/* Bottom Controls Bar inside the floating pill */}
          <div className="flex items-center justify-between px-3.5 pb-3 pt-1">
            {/* Left: + Attach button & Model Selector Pill */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-[#1d2029]' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Attach files"
              >
                <Plus size={16} />
              </button>

              {/* Antigravity Model Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors ${
                    isDark 
                      ? 'bg-[#0d0e12] border-[#21242e] text-gray-300 hover:border-[#2d313d]' 
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="max-w-[150px] truncate">{currentModel}</span>
                  <ChevronUp size={11} className="text-gray-500" />
                </button>

                {showModelDropdown && (
                  <div className={`absolute bottom-full left-0 mb-1.5 w-64 rounded-2xl shadow-2xl z-50 border p-2 ${
                    isDark ? 'bg-[#14161d] border-[#21242e]' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Available Models</span>
                      <button
                        type="button"
                        onClick={async () => {
                          const apiKey = settings.apiKeys[agent.apiKeyName] || '';
                          const baseUrl = settings.baseUrls[agent.apiKeyName] || agent.defaultBaseUrl;
                          try {
                            const res = await fetch('/api/models', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ apiKey, baseUrl, agentId: agent.id }),
                            });
                            const data = await res.json();
                            if (data.models && data.models.length > 0) {
                              setPaneModel(pane.id, data.models[0]);
                            }
                          } catch (_) {}
                        }}
                        className="text-[10px] text-[#0284c7] hover:underline"
                      >
                        ⚡ Detect
                      </button>
                    </div>
                    {agent.availableModels.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setPaneModel(pane.id, m);
                          setShowModelDropdown(false);
                        }}
                        className={`flex items-center justify-between w-full px-2 py-1.5 rounded-xl text-xs font-mono text-left transition-colors ${
                          m === currentModel
                            ? 'bg-[#0284c7] text-white'
                            : isDark ? 'hover:bg-[#1d2029] text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="truncate">{m}</span>
                        {m === currentModel && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}

                    <div className="mt-2 pt-2 border-t border-[#21242e]">
                      <div className="text-[10px] text-gray-500 px-2 mb-1">Custom Model Name:</div>
                      <div className="flex items-center space-x-1 px-1">
                        <input
                          type="text"
                          placeholder="e.g. o1-preview, claude-3-7..."
                          value={customModelInput}
                          onChange={(e) => setCustomModelInput(e.target.value)}
                          className={`flex-1 px-2 py-1 text-xs font-mono rounded-lg border outline-none ${
                            isDark ? 'bg-[#0d0e12] border-[#21242e] text-white' : 'bg-gray-50 border-gray-300'
                          }`}
                        />
                        <button
                          onClick={() => {
                            if (customModelInput.trim()) {
                              setPaneModel(pane.id, customModelInput.trim());
                              setCustomModelInput('');
                              setShowModelDropdown(false);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs bg-[#0284c7] text-white font-medium"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Voice/Mic & Arrow Send Button */}
            <div className="flex items-center space-x-1.5">
              <button
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white hover:bg-[#1d2029]' : 'text-gray-500 hover:bg-gray-100'
                }`}
                title="Voice input"
              >
                <Mic size={16} />
              </button>

              <button
                onClick={() => {
                  if ((pane.input.trim() || (pane.attachments && pane.attachments.length > 0)) && !pane.isLoading) {
                    sendMessage(pane.id);
                  }
                }}
                disabled={(!pane.input.trim() && (!pane.attachments || pane.attachments.length === 0)) || pane.isLoading}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  (pane.input.trim() || (pane.attachments && pane.attachments.length > 0)) && !pane.isLoading
                    ? 'bg-[#0284c7] text-white hover:bg-[#0369a1]'
                    : isDark ? 'bg-[#1d2029] text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, Shield, Globe, Cpu, Key, Terminal, RefreshCw, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useChatContext } from '@/lib/chat-context';
import { AGENTS } from '@/lib/agents';
import type { AgentId } from '@/types';

export default function SettingsModal() {
  const { 
    settingsOpen, 
    toggleSettings, 
    settings, 
    updateApiKey, 
    updateBaseUrl, 
    updateModel, 
    updateSystemPrompt 
  } = useChatContext();

  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<AgentId>('claude');
  const [detecting, setDetecting] = useState(false);
  const [detectedMap, setDetectedMap] = useState<Record<string, string[]>>({});
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && settingsOpen) toggleSettings();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [settingsOpen, toggleSettings]);

  if (!settingsOpen) return null;

  const currentAgent = AGENTS.find(a => a.id === activeTab) || AGENTS[0];
  const apiKey = settings.apiKeys[currentAgent.apiKeyName] || '';
  const baseUrl = settings.baseUrls[currentAgent.apiKeyName] || currentAgent.defaultBaseUrl;
  const currentModel = settings.models[currentAgent.apiKeyName] || currentAgent.defaultModel;
  const systemPrompt = settings.systemPrompts[currentAgent.apiKeyName] || '';

  // Auto-detect models via /api/models
  const handleAutoDetectModels = async () => {
    setDetecting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          baseUrl,
          agentId: currentAgent.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setStatusMsg({ text: data.error || 'Failed to detect models.', isError: true });
      } else if (Array.isArray(data.models) && data.models.length > 0) {
        setDetectedMap(prev => ({ ...prev, [currentAgent.id]: data.models }));
        setStatusMsg({ text: `✓ Detected ${data.models.length} live models from your API!` });
        // If current model isn't in detected models, pick the first one
        if (!data.models.includes(currentModel)) {
          updateModel(currentAgent.apiKeyName, data.models[0]);
        }
      } else {
        setStatusMsg({ text: 'No models found on this endpoint.', isError: true });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Network detection error.', isError: true });
    } finally {
      setDetecting(false);
    }
  };

  // Combine default available models with any auto-detected models
  const displayedModels = detectedMap[currentAgent.id] && detectedMap[currentAgent.id].length > 0
    ? detectedMap[currentAgent.id].slice(0, 16) // top 16 detected models
    : currentAgent.availableModels;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={toggleSettings}
      />
      
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
        isDark ? 'bg-[#14161d] border border-[#21242e]' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-3.5 border-b ${
          isDark ? 'border-[#21242e]' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-white">Agent & API Configuration</span>
          </div>
          <button 
            onClick={toggleSettings}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-gray-400 hover:bg-[#1d2029] hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Navigation */}
          <div className={`w-48 border-r overflow-y-auto p-2 space-y-1 ${
            isDark ? 'bg-[#090a0d] border-[#21242e]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-1.5">
              Providers
            </div>
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setActiveTab(agent.id);
                  setStatusMsg(null);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-left transition-colors text-xs ${
                  activeTab === agent.id
                    ? 'bg-[#1d2029] text-white font-medium border border-[#2d313d]'
                    : isDark ? 'text-gray-400 hover:bg-[#14161d] hover:text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-base">{agent.icon}</span>
                <div className="truncate">
                  <div>{agent.name}</div>
                  <div className="text-[10px] text-gray-500 truncate">{agent.provider}</div>
                </div>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-[#21242e]/60 px-3">
              <div className="flex items-center space-x-1.5 text-[#0284c7] text-xs font-semibold mb-1">
                <Shield size={13} />
                <span>Local Privacy</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">
                Keys & endpoints stay strictly in your browser.
              </p>
            </div>
          </div>

          {/* Right Configs */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-[#21242e]">
              <span className="text-2xl">{currentAgent.icon}</span>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentAgent.name}
                </h3>
                <p className="text-[11px] text-gray-500">{currentAgent.description}</p>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300 flex items-center">
                  <Key size={12} className="mr-1.5 text-[#0284c7]" />
                  API Key
                </label>
                <span className="text-[10px] text-gray-500 font-mono">{currentAgent.apiKeyName}</span>
              </div>
              <div className="relative">
                <input
                  type={showKey[currentAgent.apiKeyName] ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => updateApiKey(currentAgent.apiKeyName, e.target.value)}
                  placeholder={`Enter your ${currentAgent.provider} API key`}
                  className={`w-full pl-3 pr-10 py-1.5 rounded-xl text-xs font-mono outline-none border transition-all ${
                    isDark 
                      ? 'bg-[#090a0d] border-[#21242e] text-white focus:border-[#0284c7]' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(prev => ({ ...prev, [currentAgent.apiKeyName]: !prev[currentAgent.apiKeyName] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showKey[currentAgent.apiKeyName] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Base URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300 flex items-center">
                  <Globe size={12} className="mr-1.5 text-[#0284c7]" />
                  Base URL (API Endpoint)
                </label>
                <div className="flex items-center space-x-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => updateBaseUrl(currentAgent.apiKeyName, currentAgent.defaultBaseUrl)}
                    className="text-[#0284c7] hover:underline"
                  >
                    Default
                  </button>
                  <span className="text-gray-600">|</span>
                  <button
                    type="button"
                    onClick={() => updateBaseUrl(currentAgent.apiKeyName, 'https://openrouter.ai/api/v1')}
                    className="text-gray-400 hover:text-white"
                  >
                    OpenRouter
                  </button>
                  <span className="text-gray-600">|</span>
                  <button
                    type="button"
                    onClick={() => updateBaseUrl(currentAgent.apiKeyName, 'http://localhost:11434/v1')}
                    className="text-gray-400 hover:text-white"
                  >
                    Ollama
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => updateBaseUrl(currentAgent.apiKeyName, e.target.value)}
                placeholder={currentAgent.defaultBaseUrl}
                className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono outline-none border transition-all ${
                  isDark 
                    ? 'bg-[#090a0d] border-[#21242e] text-white focus:border-[#0284c7]' 
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>

            {/* Default Model + Auto-Detect Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300 flex items-center">
                  <Cpu size={12} className="mr-1.5 text-[#0284c7]" />
                  Available Models
                </label>

                {/* Live Auto-Detect Button */}
                <button
                  type="button"
                  onClick={handleAutoDetectModels}
                  disabled={detecting}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    detecting
                      ? 'bg-[#1d2029] text-gray-400 cursor-wait'
                      : 'bg-[#0284c7]/20 hover:bg-[#0284c7]/30 text-[#38bdf8] border border-[#0284c7]/40'
                  }`}
                  title="Query your API key to detect all models available for your account"
                >
                  <RefreshCw size={11} className={detecting ? 'animate-spin' : ''} />
                  <span>{detecting ? 'Detecting...' : '⚡ Auto-Detect Models'}</span>
                </button>
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono flex items-center space-x-1.5 ${
                  statusMsg.isError ? 'bg-red-950/40 text-red-300 border border-red-800/50' : 'bg-[#0284c7]/10 text-[#38bdf8] border border-[#0284c7]/30'
                }`}>
                  {statusMsg.isError ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* Model Tiles */}
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {displayedModels.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateModel(currentAgent.apiKeyName, m)}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-mono border transition-all truncate ${
                      currentModel === m
                        ? 'bg-[#1d2029] border-[#0284c7] text-[#38bdf8] font-semibold'
                        : 'bg-[#090a0d] border-[#21242e] text-gray-400 hover:border-[#2d313d]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Custom Model Input */}
              <input
                type="text"
                value={currentModel}
                onChange={(e) => updateModel(currentAgent.apiKeyName, e.target.value)}
                placeholder="Or type any custom model ID..."
                className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono outline-none border ${
                  isDark ? 'bg-[#090a0d] border-[#21242e] text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            {/* System Prompt */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 flex items-center">
                <Terminal size={12} className="mr-1.5 text-[#0284c7]" />
                Custom System Instructions
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => updateSystemPrompt(currentAgent.apiKeyName, e.target.value)}
                placeholder="Optional custom instructions for this agent..."
                rows={2}
                className={`w-full px-3 py-1.5 rounded-xl text-xs outline-none border resize-none ${
                  isDark ? 'bg-[#090a0d] border-[#21242e] text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t flex items-center justify-between ${
          isDark ? 'border-[#21242e] bg-[#090a0d]' : 'border-gray-200 bg-gray-50'
        }`}>
          <span className="text-[11px] text-gray-500">Settings auto-saved locally</span>
          <button
            onClick={toggleSettings}
            className="px-4 py-1.5 rounded-xl text-xs font-medium bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

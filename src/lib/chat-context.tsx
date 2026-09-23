'use client';

import React, { createContext, useContext, useEffect, useReducer, useCallback, useRef, useState } from 'react';
import { AgentId, AppSettings, Message, PaneState, FileAttachment, WorkspaceFile } from '@/types';
import { getAgent, AGENTS } from '@/lib/agents';

interface ChatState {
  panes: PaneState[];
  activePaneId: string;
  settings: AppSettings;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  workspaceFiles: WorkspaceFile[];
  workspaceFolderName: string | null;
  selectedFileForViewer: WorkspaceFile | null;
}

type Action =
  | { type: 'ADD_PANE'; payload: { agentId: AgentId } }
  | { type: 'REMOVE_PANE'; payload: string }
  | { type: 'SET_ACTIVE_PANE'; payload: string }
  | { type: 'UPDATE_PANE_INPUT'; payload: { paneId: string; input: string } }
  | { type: 'SET_LAYOUT'; payload: AppSettings['layout'] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'UPDATE_API_KEY'; payload: { keyName: string; value: string } }
  | { type: 'UPDATE_BASE_URL'; payload: { keyName: string; value: string } }
  | { type: 'UPDATE_MODEL'; payload: { keyName: string; value: string } }
  | { type: 'UPDATE_SYSTEM_PROMPT'; payload: { keyName: string; value: string } }
  | { type: 'SET_PANE_MODEL'; payload: { paneId: string; model: string } }
  | { type: 'SET_SIDEBAR_TAB'; payload: AppSettings['sidebarTab'] }
  | { type: 'TOGGLE_THEME' }
  | { type: 'CLEAR_MESSAGES'; payload: string }
  | { type: 'SWITCH_AGENT'; payload: { paneId: string; agentId: AgentId } }
  | { type: 'ADD_MESSAGE'; payload: { paneId: string; message: Message } }
  | { type: 'SET_PANE_LOADING'; payload: { paneId: string; isLoading: boolean } }
  | { type: 'ADD_ATTACHMENT'; payload: { paneId: string; file: FileAttachment } }
  | { type: 'REMOVE_ATTACHMENT'; payload: { paneId: string; attachmentId: string } }
  | { type: 'CLEAR_ATTACHMENTS'; payload: string }
  | { type: 'SET_WORKSPACE'; payload: { files: WorkspaceFile[]; folderName: string } }
  | { type: 'SET_VIEWER_FILE'; payload: WorkspaceFile | null }
  | { type: 'LOAD_SETTINGS'; payload: AppSettings };

const initialState: ChatState = {
  panes: [
    {
      id: 'pane-1',
      agentId: 'claude',
      messages: [],
      isLoading: false,
      input: '',
      attachments: [],
    },
  ],
  activePaneId: 'pane-1',
  settings: {
    apiKeys: {},
    baseUrls: {},
    models: {},
    systemPrompts: {},
    theme: 'dark',
    layout: 'single',
    sidebarTab: 'agents',
  },
  sidebarOpen: true,
  settingsOpen: false,
  workspaceFiles: [],
  workspaceFolderName: null,
  selectedFileForViewer: null,
};

function chatReducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'ADD_PANE': {
      const newPane: PaneState = {
        id: Date.now().toString(),
        agentId: action.payload.agentId,
        messages: [],
        isLoading: false,
        input: '',
        attachments: [],
      };
      return {
        ...state,
        panes: [...state.panes, newPane],
        activePaneId: newPane.id,
      };
    }
    case 'REMOVE_PANE': {
      const newPanes = state.panes.filter((p) => p.id !== action.payload);
      const newActiveId =
        state.activePaneId === action.payload
          ? newPanes[0]?.id || ''
          : state.activePaneId;
      return {
        ...state,
        panes: newPanes,
        activePaneId: newActiveId,
      };
    }
    case 'SET_ACTIVE_PANE':
      return { ...state, activePaneId: action.payload };
    case 'UPDATE_PANE_INPUT':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload.paneId ? { ...p, input: action.payload.input } : p
        ),
      };
    case 'SET_LAYOUT':
      return { ...state, settings: { ...state.settings, layout: action.payload } };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'TOGGLE_SETTINGS':
      return { ...state, settingsOpen: !state.settingsOpen };
    case 'UPDATE_API_KEY':
      return {
        ...state,
        settings: {
          ...state.settings,
          apiKeys: {
            ...state.settings.apiKeys,
            [action.payload.keyName]: action.payload.value,
          },
        },
      };
    case 'UPDATE_BASE_URL':
      return {
        ...state,
        settings: {
          ...state.settings,
          baseUrls: {
            ...state.settings.baseUrls,
            [action.payload.keyName]: action.payload.value,
          },
        },
      };
    case 'UPDATE_MODEL':
      return {
        ...state,
        settings: {
          ...state.settings,
          models: {
            ...state.settings.models,
            [action.payload.keyName]: action.payload.value,
          },
        },
      };
    case 'UPDATE_SYSTEM_PROMPT':
      return {
        ...state,
        settings: {
          ...state.settings,
          systemPrompts: {
            ...state.settings.systemPrompts,
            [action.payload.keyName]: action.payload.value,
          },
        },
      };
    case 'SET_PANE_MODEL':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload.paneId ? { ...p, modelOverride: action.payload.model } : p
        ),
      };
    case 'SET_SIDEBAR_TAB':
      return {
        ...state,
        settings: { ...state.settings, sidebarTab: action.payload },
      };
    case 'TOGGLE_THEME': {
      const newTheme = state.settings.theme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return {
        ...state,
        settings: { ...state.settings, theme: newTheme },
      };
    }
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload ? { ...p, messages: [] } : p
        ),
      };
    case 'SWITCH_AGENT':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload.paneId
            ? { ...p, agentId: action.payload.agentId, modelOverride: undefined, messages: [] }
            : p
        ),
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload.paneId
            ? { ...p, messages: [...p.messages, action.payload.message] }
            : p
        ),
      };
    case 'SET_PANE_LOADING':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload.paneId
            ? { ...p, isLoading: action.payload.isLoading }
            : p
        ),
      };
    case 'ADD_ATTACHMENT':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload.paneId
            ? { ...p, attachments: [...(p.attachments || []), action.payload.file] }
            : p
        ),
      };
    case 'REMOVE_ATTACHMENT':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload.paneId
            ? { ...p, attachments: (p.attachments || []).filter(a => a.id !== action.payload.attachmentId) }
            : p
        ),
      };
    case 'CLEAR_ATTACHMENTS':
      return {
        ...state,
        panes: state.panes.map((p) =>
          p.id === action.payload ? { ...p, attachments: [] } : p
        ),
      };
    case 'SET_WORKSPACE':
      return {
        ...state,
        workspaceFiles: action.payload.files,
        workspaceFolderName: action.payload.folderName,
      };
    case 'SET_VIEWER_FILE':
      return {
        ...state,
        selectedFileForViewer: action.payload,
      };
    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    default:
      return state;
  }
}

interface ChatContextValue extends ChatState {
  addPane: (agentId: AgentId) => void;
  removePane: (paneId: string) => void;
  setActivePaneId: (id: string) => void;
  updatePaneInput: (paneId: string, input: string) => void;
  sendMessage: (paneId: string) => Promise<void>;
  setLayout: (layout: AppSettings['layout']) => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  updateApiKey: (keyName: string, value: string) => void;
  updateBaseUrl: (keyName: string, value: string) => void;
  updateModel: (keyName: string, value: string) => void;
  updateSystemPrompt: (keyName: string, value: string) => void;
  setPaneModel: (paneId: string, model: string) => void;
  setSidebarTab: (tab: AppSettings['sidebarTab']) => void;
  toggleTheme: () => void;
  clearMessages: (paneId: string) => void;
  switchAgent: (paneId: string, agentId: AgentId) => void;
  addAttachment: (paneId: string, file: FileAttachment) => void;
  removeAttachment: (paneId: string, attachmentId: string) => void;
  clearAttachments: (paneId: string) => void;
  setWorkspace: (files: WorkspaceFile[], folderName: string) => void;
  setViewerFile: (file: WorkspaceFile | null) => void;
  handoffMessage: (sourceContent: string, targetAgentId: AgentId) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
    const saved = localStorage.getItem('bond-settings-v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsed });
        if (parsed.theme === 'light') {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bond-settings-v2', JSON.stringify(state.settings));
  }, [state.settings]);

  const addPane = useCallback((agentId: AgentId) => {
    dispatch({ type: 'ADD_PANE', payload: { agentId } });
  }, []);

  const removePane = useCallback((paneId: string) => {
    dispatch({ type: 'REMOVE_PANE', payload: paneId });
  }, []);

  const setActivePaneId = useCallback((id: string) => {
    dispatch({ type: 'SET_ACTIVE_PANE', payload: id });
  }, []);

  const updatePaneInput = useCallback((paneId: string, input: string) => {
    dispatch({ type: 'UPDATE_PANE_INPUT', payload: { paneId, input } });
  }, []);

  const setLayout = useCallback((layout: AppSettings['layout']) => {
    dispatch({ type: 'SET_LAYOUT', payload: layout });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const toggleSettings = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  }, []);

  const updateApiKey = useCallback((keyName: string, value: string) => {
    dispatch({ type: 'UPDATE_API_KEY', payload: { keyName, value } });
  }, []);

  const updateBaseUrl = useCallback((keyName: string, value: string) => {
    dispatch({ type: 'UPDATE_BASE_URL', payload: { keyName, value } });
  }, []);

  const updateModel = useCallback((keyName: string, value: string) => {
    dispatch({ type: 'UPDATE_MODEL', payload: { keyName, value } });
  }, []);

  const updateSystemPrompt = useCallback((keyName: string, value: string) => {
    dispatch({ type: 'UPDATE_SYSTEM_PROMPT', payload: { keyName, value } });
  }, []);

  const setPaneModel = useCallback((paneId: string, model: string) => {
    dispatch({ type: 'SET_PANE_MODEL', payload: { paneId, model } });
  }, []);

  const setSidebarTab = useCallback((tab: AppSettings['sidebarTab']) => {
    dispatch({ type: 'SET_SIDEBAR_TAB', payload: tab });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const clearMessages = useCallback((paneId: string) => {
    dispatch({ type: 'CLEAR_MESSAGES', payload: paneId });
  }, []);

  const switchAgent = useCallback((paneId: string, agentId: AgentId) => {
    dispatch({ type: 'SWITCH_AGENT', payload: { paneId, agentId } });
  }, []);

  const addAttachment = useCallback((paneId: string, file: FileAttachment) => {
    dispatch({ type: 'ADD_ATTACHMENT', payload: { paneId, file } });
  }, []);

  const removeAttachment = useCallback((paneId: string, attachmentId: string) => {
    dispatch({ type: 'REMOVE_ATTACHMENT', payload: { paneId, attachmentId } });
  }, []);

  const clearAttachments = useCallback((paneId: string) => {
    dispatch({ type: 'CLEAR_ATTACHMENTS', payload: paneId });
  }, []);

  const setWorkspace = useCallback((files: WorkspaceFile[], folderName: string) => {
    dispatch({ type: 'SET_WORKSPACE', payload: { files, folderName } });
  }, []);

  const setViewerFile = useCallback((file: WorkspaceFile | null) => {
    dispatch({ type: 'SET_VIEWER_FILE', payload: file });
  }, []);

  const handoffMessage = useCallback((sourceContent: string, targetAgentId: AgentId) => {
    const currentState = stateRef.current;
    // Find if a pane with targetAgent exists, else create one
    let targetPane = currentState.panes.find(p => p.agentId === targetAgentId);
    if (!targetPane) {
      dispatch({ type: 'ADD_PANE', payload: { agentId: targetAgentId } });
      setTimeout(() => {
        const updated = stateRef.current;
        const newTarget = updated.panes.find(p => p.agentId === targetAgentId);
        if (newTarget) {
          dispatch({ 
            type: 'UPDATE_PANE_INPUT', 
            payload: { 
              paneId: newTarget.id, 
              input: `Please review and improve this solution:\n\n${sourceContent}` 
            } 
          });
        }
      }, 100);
    } else {
      dispatch({ type: 'SET_ACTIVE_PANE', payload: targetPane.id });
      dispatch({ 
        type: 'UPDATE_PANE_INPUT', 
        payload: { 
          paneId: targetPane.id, 
          input: `Please review and improve this solution:\n\n${sourceContent}` 
        } 
      });
    }
  }, []);

  const sendMessage = useCallback(async (paneId: string) => {
    const currentState = stateRef.current;
    const pane = currentState.panes.find((p) => p.id === paneId);
    if (!pane || (!pane.input.trim() && (!pane.attachments || pane.attachments.length === 0))) return;

    const agent = getAgent(pane.agentId);
    if (!agent) return;

    const currentAttachments = [...(pane.attachments || [])];
    const userPrompt = pane.input.trim() || (currentAttachments.length > 0 ? `Please analyze the attached file(s): ${currentAttachments.map(a => a.name).join(', ')}` : '');

    const userMsgId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: userPrompt,
      timestamp: Date.now(),
      agentId: pane.agentId,
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { paneId, message: userMessage } });
    dispatch({ type: 'UPDATE_PANE_INPUT', payload: { paneId, input: '' } });
    dispatch({ type: 'CLEAR_ATTACHMENTS', payload: paneId });
    dispatch({ type: 'SET_PANE_LOADING', payload: { paneId, isLoading: true } });

    const messagesToSend = pane.messages.concat(userMessage).map(m => ({
      role: m.role,
      content: m.content,
    }));

    const apiKey = currentState.settings.apiKeys[agent.apiKeyName] || '';
    const baseUrl = currentState.settings.baseUrls[agent.apiKeyName] || agent.defaultBaseUrl;
    const model = pane.modelOverride || currentState.settings.models[agent.apiKeyName] || agent.defaultModel;
    const systemPrompt = currentState.settings.systemPrompts[agent.apiKeyName] || '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend,
          agentId: pane.agentId,
          apiKey,
          baseUrl,
          model,
          systemPrompt,
          attachments: currentAttachments,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      
      const assistantMsgId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const assistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: data.content || 'No response',
        timestamp: Date.now(),
        agentId: pane.agentId,
        modelUsed: data.modelUsed || model,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: { paneId, message: assistantMessage } });
    } catch (error: any) {
      const errorMsgId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const errorMessage: Message = {
        id: errorMsgId,
        role: 'assistant',
        content: `Connection Error: ${error.message || 'An error occurred while connecting to the agent.'}`,
        timestamp: Date.now(),
        agentId: pane.agentId,
      };
      dispatch({ type: 'ADD_MESSAGE', payload: { paneId, message: errorMessage } });
    } finally {
      dispatch({ type: 'SET_PANE_LOADING', payload: { paneId, isLoading: false } });
    }
  }, []);

  const value = {
    ...state,
    addPane,
    removePane,
    setActivePaneId,
    updatePaneInput,
    sendMessage,
    setLayout,
    toggleSidebar,
    toggleSettings,
    updateApiKey,
    updateBaseUrl,
    updateModel,
    updateSystemPrompt,
    setPaneModel,
    setSidebarTab,
    toggleTheme,
    clearMessages,
    switchAgent,
    addAttachment,
    removeAttachment,
    clearAttachments,
    setWorkspace,
    setViewerFile,
    handoffMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

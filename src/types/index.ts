export type AgentId = 'claude' | 'gpt4' | 'gemini' | 'grok' | 'deepseek' | 'hermes';

export interface Agent {
  id: AgentId;
  name: string;
  provider: string;
  description: string;
  color: string;
  icon: string;
  apiKeyName: string;
  defaultModel: string;
  availableModels: string[];
  defaultBaseUrl: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // text content or dataUrl for images
  isImage?: boolean;
}

export interface WorkspaceFile {
  name: string;
  path: string;
  content?: string;
  size?: number;
  isDirectory: boolean;
  children?: WorkspaceFile[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  agentId: AgentId;
  modelUsed?: string;
  attachments?: FileAttachment[];
}

export interface PaneState {
  id: string;
  agentId: AgentId;
  modelOverride?: string;
  messages: Message[];
  isLoading: boolean;
  input: string;
  attachments: FileAttachment[];
}

export interface AppSettings {
  apiKeys: Record<string, string>;
  baseUrls: Record<string, string>;
  models: Record<string, string>;
  detectedModels?: Record<string, string[]>;
  systemPrompts: Record<string, string>;
  theme: 'dark' | 'light';
  layout: 'single' | 'split' | 'quad';
  sidebarTab: 'agents' | 'workspace';
}

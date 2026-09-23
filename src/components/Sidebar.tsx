'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  X, 
  Folder, 
  FolderOpen, 
  FileCode, 
  Search, 
  Settings, 
  Clock, 
  MessageSquare, 
  Bot, 
  Pin,
  ChevronDown,
  Upload
} from 'lucide-react';
import { useChatContext } from '@/lib/chat-context';
import { AGENTS } from '@/lib/agents';
import type { AgentId, WorkspaceFile } from '@/types';

export default function Sidebar() {
  const { 
    panes, 
    sidebarOpen, 
    addPane, 
    removePane, 
    activePaneId, 
    setActivePaneId, 
    settings, 
    setSidebarTab,
    workspaceFiles,
    workspaceFolderName,
    setWorkspace,
    setViewerFile,
    toggleSettings,
  } = useChatContext();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [fileSearch, setFileSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = settings.theme === 'dark';
  const activeTab = settings.sidebarTab || 'agents';

  // Handle local folder selection
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const parsedFiles: WorkspaceFile[] = [];
    const rootName = files[0].webkitRelativePath?.split('/')[0] || 'Project Folder';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = '';
      if (file.size < 1024 * 1024 && (
        file.name.match(/\.(ts|tsx|js|jsx|json|md|txt|py|css|html|csv|yml|yaml|go|rs|cpp|c|h|java|sql)$/i)
      )) {
        try {
          content = await file.text();
        } catch (_) {}
      }

      parsedFiles.push({
        name: file.name,
        path: file.webkitRelativePath || file.name,
        size: file.size,
        isDirectory: false,
        content: content || undefined,
      });
    }

    setWorkspace(parsedFiles, rootName);
    setSidebarTab('workspace');
  };

  const handleNativeDirectoryPicker = async () => {
    if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker();
        const parsedFiles: WorkspaceFile[] = [];

        const readDir = async (handle: any, currentPath: string) => {
          for await (const entry of handle.values()) {
            const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
            if (entry.kind === 'file') {
              const file = await entry.getFile();
              let content = '';
              if (file.size < 1024 * 1024 && file.name.match(/\.(ts|tsx|js|jsx|json|md|txt|py|css|html|csv|yml|yaml)$/i)) {
                try {
                  content = await file.text();
                } catch (_) {}
              }
              parsedFiles.push({
                name: entry.name,
                path: entryPath,
                size: file.size,
                isDirectory: false,
                content: content || undefined,
              });
            } else if (entry.kind === 'directory' && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.next') {
              await readDir(entry, entryPath);
            }
          }
        };

        await readDir(dirHandle, '');
        setWorkspace(parsedFiles, dirHandle.name);
        setSidebarTab('workspace');
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }
    fileInputRef.current?.click();
  };

  const filteredFiles = workspaceFiles.filter(f => 
    !fileSearch || f.name.toLowerCase().includes(fileSearch.toLowerCase()) || f.path.toLowerCase().includes(fileSearch.toLowerCase())
  );

  return (
    <aside className={`flex flex-col h-full transition-all duration-200 ease-in-out border-r z-10 select-none ${
      isDark ? 'bg-[#090a0d] border-[#21242e]' : 'bg-[#f7f8fa] border-gray-200'
    } ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-none'}`}>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFolderUpload}
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
      />

      {/* Top action: Antigravity-style + New Agent button */}
      <div className="p-3">
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-medium border transition-colors ${
              isDark 
                ? 'bg-[#14161d] border-[#21242e] text-[#ededed] hover:border-[#2d313d] hover:bg-[#1a1c25]' 
                : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Plus size={15} className="text-gray-400" />
              <span>New Agent Pane</span>
            </div>
            <ChevronDown size={13} className="text-gray-500" />
          </button>

          {showAddMenu && (
            <div className={`absolute top-full left-0 mt-1 w-full rounded-xl shadow-2xl z-50 border p-1 ${
              isDark ? 'bg-[#14161d] border-[#21242e]' : 'bg-white border-gray-200'
            }`}>
              {AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => {
                    addPane(agent.id as AgentId);
                    setShowAddMenu(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                    isDark ? 'hover:bg-[#1d2029] text-gray-200' : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <span className="mr-2 text-base">{agent.icon}</span>
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-[10px] text-gray-500 ml-auto font-mono">{agent.provider}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nav Tabs like Antigravity */}
      <div className="px-3 pb-2 flex space-x-1">
        <button
          onClick={() => setSidebarTab('agents')}
          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'agents'
              ? (isDark ? 'bg-[#1d2029] text-white' : 'bg-white text-black shadow-sm')
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Panes ({panes.length})
        </button>
        <button
          onClick={() => setSidebarTab('workspace')}
          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'workspace'
              ? (isDark ? 'bg-[#1d2029] text-white' : 'bg-white text-black shadow-sm')
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Files {workspaceFiles.length > 0 && `(${workspaceFiles.length})`}
        </button>
      </div>

      {/* TAB 1: ACTIVE AGENTS LIST */}
      {activeTab === 'agents' && (
        <div className="flex-1 overflow-y-auto px-2 space-y-4">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 px-2 py-1 flex items-center justify-between">
              <span>Active Agents</span>
            </div>

            <div className="space-y-0.5">
              {panes.map((pane) => {
                const agent = AGENTS.find(a => a.id === pane.agentId);
                if (!agent) return null;
                const isActive = pane.id === activePaneId;
                const currentModel = pane.modelOverride || settings.models[agent.apiKeyName] || agent.defaultModel;

                return (
                  <div
                    key={pane.id}
                    onClick={() => setActivePaneId(pane.id)}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition-colors ${
                      isActive
                        ? (isDark ? 'bg-[#1d2029] text-white' : 'bg-white text-black shadow-sm border border-gray-200')
                        : isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#14161d]' : 'text-gray-600 hover:bg-gray-200/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0 pr-1">
                      <span className="text-base flex-shrink-0">{agent.icon}</span>
                      <div className="truncate">
                        <div className="text-xs font-medium truncate">{agent.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono truncate">{currentModel}</div>
                      </div>
                    </div>

                    {panes.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePane(pane.id);
                        }}
                        className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDark ? 'hover:text-red-400 hover:bg-[#252834]' : 'hover:text-red-500'
                        }`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Folder Quick Mount */}
          <div className="pt-2 border-t border-[#21242e]/60">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 px-2 mb-1.5">
              Workspace Project
            </div>
            <button
              onClick={handleNativeDirectoryPicker}
              className={`w-full py-2 px-2.5 rounded-xl flex items-center space-x-2 text-xs transition-colors ${
                isDark 
                  ? 'bg-[#14161d] border border-[#21242e] text-gray-300 hover:text-white hover:border-[#2d313d]' 
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              <Folder size={14} className="text-[#0284c7] flex-shrink-0" />
              <span className="truncate">{workspaceFolderName ? workspaceFolderName : 'Open Local Folder...'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: WORKSPACE FILE EXPLORER */}
      {activeTab === 'workspace' && (
        <div className="flex-1 flex flex-col overflow-hidden px-2">
          <div className="mb-2">
            {workspaceFolderName ? (
              <div className="flex items-center justify-between py-1 px-1">
                <div className="flex items-center space-x-1.5 truncate">
                  <FolderOpen size={14} className="text-[#0284c7] flex-shrink-0" />
                  <span className="text-xs font-semibold truncate text-white">{workspaceFolderName}</span>
                </div>
                <button
                  onClick={handleNativeDirectoryPicker}
                  className="text-[10px] text-[#0284c7] hover:underline flex-shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={handleNativeDirectoryPicker}
                className="w-full py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 text-xs font-medium bg-[#1d2029] hover:bg-[#252834] text-white transition-colors"
              >
                <Upload size={13} />
                <span>Open Project Folder</span>
              </button>
            )}

            {workspaceFiles.length > 0 && (
              <div className="relative mt-1.5">
                <input
                  type="text"
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  placeholder="Filter files..."
                  className={`w-full pl-7 pr-2.5 py-1.5 text-xs rounded-lg outline-none border ${
                    isDark ? 'bg-[#14161d] border-[#21242e] text-white focus:border-[#0284c7]' : 'bg-white border-gray-200'
                  }`}
                />
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5 font-mono text-xs">
            {workspaceFiles.length === 0 ? (
              <div className="text-center py-10 px-3 text-gray-500 text-xs">
                No folder opened yet.
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.path}
                  onClick={() => setViewerFile(file)}
                  className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${
                    isDark ? 'hover:bg-[#1d2029] text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileCode size={13} className="text-[#0284c7] flex-shrink-0" />
                  <span className="truncate text-xs">{file.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Bottom Settings Link */}
      <div className={`p-3 border-t ${isDark ? 'border-[#21242e]' : 'border-gray-200'}`}>
        <button
          onClick={toggleSettings}
          className={`flex items-center space-x-2 text-xs transition-colors w-full px-2 py-1.5 rounded-lg ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-[#14161d]' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings size={15} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

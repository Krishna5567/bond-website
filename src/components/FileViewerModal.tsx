'use client';

import React, { useState } from 'react';
import { X, Copy, Check, FileText, Paperclip } from 'lucide-react';
import { useChatContext } from '@/lib/chat-context';

export default function FileViewerModal() {
  const { selectedFileForViewer, setViewerFile, activePaneId, addAttachment, settings } = useChatContext();
  const [copied, setCopied] = useState(false);
  const isDark = settings.theme === 'dark';

  if (!selectedFileForViewer) return null;

  const handleCopy = () => {
    if (selectedFileForViewer.content) {
      navigator.clipboard.writeText(selectedFileForViewer.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAttachToActive = () => {
    if (selectedFileForViewer.content && activePaneId) {
      addAttachment(activePaneId, {
        id: Date.now().toString(),
        name: selectedFileForViewer.name,
        size: selectedFileForViewer.size || selectedFileForViewer.content.length,
        type: 'text/plain',
        content: selectedFileForViewer.content,
      });
      setViewerFile(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={() => setViewerFile(null)}
      />
      
      <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
        isDark ? 'bg-[#14161d] border border-[#21242e]' : 'bg-white border border-gray-200'
      }`}>
        <div className={`flex items-center justify-between px-5 py-3 border-b ${
          isDark ? 'border-[#21242e]' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <FileText size={16} className="text-[#0284c7]" />
            <span className={`font-mono font-medium text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedFileForViewer.name}
            </span>
            <span className="text-[10px] text-gray-500">({selectedFileForViewer.path})</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAttachToActive}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0284c7] text-white hover:bg-[#0369a1] transition-colors"
              title="Attach this file to active AI agent"
            >
              <Paperclip size={12} />
              <span>Attach to Agent</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                isDark ? 'bg-[#1d2029] text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {copied ? <Check size={13} className="text-[#0284c7]" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => setViewerFile(null)}
              className={`p-1 rounded-lg transition-colors ${
                isDark ? 'text-gray-400 hover:text-white hover:bg-[#1d2029]' : 'text-gray-500 hover:text-black hover:bg-gray-100'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed bg-[#090a0d] text-gray-200">
          <pre>
            <code>{selectedFileForViewer.content || '// Empty file or binary content.'}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { PanelLeft, PanelLeftClose, Layout, Columns2, Grid2x2, Moon, Sun, Settings, Sparkles, Folder } from 'lucide-react';
import { useChatContext } from '@/lib/chat-context';

export default function Header() {
  const { 
    sidebarOpen, 
    toggleSidebar, 
    settings, 
    setLayout, 
    toggleTheme, 
    toggleSettings,
    workspaceFolderName,
  } = useChatContext();

  const isDark = settings.theme === 'dark';

  return (
    <header className={`flex items-center justify-between w-full h-12 px-3.5 border-b z-20 ${
      isDark ? 'bg-[#0d0e12] border-[#21242e]' : 'bg-white border-gray-200'
    }`}>
      {/* Left side: Sidebar toggle + Antigravity style breadcrumb */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleSidebar} 
          className={`p-1.5 rounded-lg transition-colors ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-[#1d2029]' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Toggle Sidebar"
        >
          {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeft size={17} />}
        </button>

        {/* Antigravity style minimalist Brand & Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-2 font-bold tracking-wider text-white">
            <img 
              src="/bond-logo.png" 
              alt="Bond" 
              className="w-6 h-6 rounded bg-white p-0.5 shadow-sm object-contain"
            />
            <span className="font-semibold text-sm tracking-tight text-white">BOND</span>
          </div>

          <span className="text-gray-600">/</span>

          <span className="text-gray-400 font-normal truncate max-w-[200px]">
            {workspaceFolderName ? workspaceFolderName : 'Workspace'}
          </span>
        </div>
      </div>

      {/* Right side: Layout options + Blue action button + Settings */}
      <div className="flex items-center space-x-2">
        {/* Layout Switcher */}
        <div className={`flex items-center space-x-0.5 p-0.5 rounded-lg border ${
          isDark ? 'bg-[#14161d] border-[#21242e]' : 'bg-gray-100 border-gray-200'
        }`}>
          <button 
            onClick={() => setLayout('single')} 
            className={`p-1.5 rounded-md transition-colors ${
              settings.layout === 'single' 
                ? (isDark ? 'bg-[#1d2029] text-white shadow-sm' : 'bg-white text-black shadow-sm')
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Single Pane"
          >
            <Layout size={14} />
          </button>
          <button 
            onClick={() => setLayout('split')} 
            className={`p-1.5 rounded-md transition-colors ${
              settings.layout === 'split' 
                ? (isDark ? 'bg-[#1d2029] text-white shadow-sm' : 'bg-white text-black shadow-sm')
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Split Side-by-Side"
          >
            <Columns2 size={14} />
          </button>
          <button 
            onClick={() => setLayout('quad')} 
            className={`p-1.5 rounded-md transition-colors ${
              settings.layout === 'quad' 
                ? (isDark ? 'bg-[#1d2029] text-white shadow-sm' : 'bg-white text-black shadow-sm')
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title="Quad 2x2 Grid"
          >
            <Grid2x2 size={14} />
          </button>
        </div>

        {/* Antigravity Blue Action Pill Button */}
        <button
          onClick={toggleSettings}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors shadow-sm"
        >
          <Sparkles size={12} />
          <span>Configure API</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className={`p-1.5 rounded-lg transition-colors ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-[#1d2029]' : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
          title="Toggle Theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Settings Button */}
        <button 
          onClick={toggleSettings} 
          className={`p-1.5 rounded-lg transition-colors ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-[#1d2029]' : 'text-gray-500 hover:text-black hover:bg-gray-100'
          }`}
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}

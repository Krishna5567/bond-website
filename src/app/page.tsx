'use client';

import React, { useState } from 'react';

const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@krishnatech-ind?si=divbfYPKeEpRVIB1';
const GITHUB_REPO_URL = 'https://github.com/Krishna5567/BOND';
const INSTALLER_DOWNLOAD_URL = 'https://github.com/Krishna5567/BOND/releases/download/v1.0.0/Bond-Setup-x64.exe';
const PORTABLE_DOWNLOAD_URL = 'https://github.com/Krishna5567/BOND/releases/download/v1.0.0/Bond-Portable-x64.exe';
const RELEASES_PAGE_URL = 'https://github.com/Krishna5567/BOND/releases/tag/v1.0.0';

export default function InstallBondPage() {
  const [activeTab, setActiveTab] = useState<'claude' | 'gemini' | 'fleet'>('claude');
  const [copiedCmd, setCopiedCmd] = useState(false);

  const copyInstallHint = () => {
    navigator.clipboard.writeText('curl -LO https://github.com/Krishna5567/BOND/releases/download/v1.0.0/Bond-Setup-x64.exe');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white font-sans selection:bg-[#00A86B]/30 selection:text-emerald-300">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#0a0f0d]/90 backdrop-blur-md border-b border-[#1B3B2B] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A86B] to-[#006341] p-0.5 shadow-[0_0_15px_rgba(0,168,107,0.35)] flex items-center justify-center">
              <div className="w-full h-full bg-[#111916] rounded-[10px] flex items-center justify-center">
                <span className="font-mono font-black text-sm tracking-wider text-[#10B981]">B_</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-wide text-white">BOND AI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#162920] text-[#10B981] border border-[#1B3B2B]">
                  v1.0.0
                </span>
              </div>
              <span className="text-[11px] text-[#9CA3AF] hidden sm:inline">
                Autonomous Multi-Agent Terminal Hub
              </span>
            </div>
          </div>

          {/* Navigation Action Links */}
          <div className="flex items-center gap-3">
            {/* Krishna Tech YouTube Link */}
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111916] hover:bg-[#162920] border border-[#1B3B2B] hover:border-[#00A86B] text-xs font-semibold text-white transition-all shadow-sm group"
            >
              {/* YouTube Play Icon */}
              <svg className="w-4 h-4 text-red-500 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="hidden md:inline">Tutorial:</span>
              <span className="text-[#10B981] font-bold">Krishna Tech</span>
            </a>

            {/* GitHub Repo Link */}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111916] hover:bg-[#162920] border border-[#1B3B2B] text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* Jump to download button */}
            <a
              href="#install-downloads"
              className="px-4 py-1.5 text-xs font-bold rounded-full bg-[#00A86B] hover:bg-[#10B981] text-black shadow-[0_0_15px_rgba(0,168,107,0.4)] transition-all font-mono"
            >
              Install .EXE ⤓
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 border-b border-[#1B3B2B]/60">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#006341]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[200px] bg-[#10B981]/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111916] border border-[#1B3B2B] text-xs font-semibold text-[#10B981] mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] pulse-dot"></span>
            <span>OFFICIAL WINDOWS INSTALLER & DOWNLOAD HUB</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Install <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#00A86B] to-emerald-200">Bond Desktop</span> on Windows
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#9CA3AF] max-w-3xl mx-auto mb-10 leading-relaxed">
            The autonomous multi-agent terminal hub built with native Windows <strong className="text-white">ConPTY</strong> execution. 
            Run Claude Code, OpenAI Codex, Google Gemini CLI, Grok, and local LLMs simultaneously in zero-latency terminal grids.
          </p>

          {/* Download Cards Row */}
          <div id="install-downloads" className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mb-10 scroll-mt-24 text-left">
            
            {/* Standard Setup Installer */}
            <div className="bg-[#111916] border-2 border-[#00A86B] rounded-2xl p-6 relative flex flex-col justify-between shadow-[0_0_30px_rgba(0,168,107,0.2)] hover:border-[#10B981] transition-all group">
              <div className="absolute -top-3 right-6 bg-[#00A86B] text-black font-black text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow-sm">
                Recommended
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#162920] border border-[#1B3B2B] flex items-center justify-center text-[#10B981]">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.901-1.799"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Standard Setup (.exe)</h3>
                    <span className="text-xs text-[#9CA3AF]">Windows 10 / 11 (64-bit)</span>
                  </div>
                </div>

                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  Complete setup wizard. Automatically configures Desktop shortcut, Start Menu entry, and file associations.
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-[#6B7280] mb-6 pb-4 border-b border-[#1B3B2B]">
                  <span>Size: <strong className="text-white">145.7 MB</strong></span>
                  <span>•</span>
                  <span>Ver: <strong className="text-[#10B981]">v1.0.0</strong></span>
                  <span>•</span>
                  <span>Arch: <strong className="text-white">x64</strong></span>
                </div>
              </div>

              <a
                href={INSTALLER_DOWNLOAD_URL}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00A86B] to-[#10B981] hover:from-[#10B981] hover:to-[#00A86B] text-black font-extrabold text-sm text-center shadow-[0_0_20px_rgba(0,168,107,0.4)] transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                <span>Download Bond-Setup-x64.exe</span>
                <span className="text-lg">⤓</span>
              </a>
            </div>

            {/* Portable Executable */}
            <div className="bg-[#111916] border border-[#1B3B2B] hover:border-[#006341] rounded-2xl p-6 relative flex flex-col justify-between transition-all">
              <div className="absolute -top-3 right-6 bg-[#162920] border border-[#1B3B2B] text-[#9CA3AF] font-bold text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full">
                Zero Install
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#162920] border border-[#1B3B2B] flex items-center justify-center text-[#9CA3AF]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Portable Edition (.exe)</h3>
                    <span className="text-xs text-[#9CA3AF]">No Administrator Rights Needed</span>
                  </div>
                </div>

                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
                  Single standalone binary. Extract and run directly from any folder, external drive, or USB without touching the Windows registry.
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-[#6B7280] mb-6 pb-4 border-b border-[#1B3B2B]">
                  <span>Size: <strong className="text-white">145.5 MB</strong></span>
                  <span>•</span>
                  <span>Ver: <strong className="text-[#10B981]">v1.0.0</strong></span>
                  <span>•</span>
                  <span>Type: <strong className="text-white">Standalone</strong></span>
                </div>
              </div>

              <a
                href={PORTABLE_DOWNLOAD_URL}
                className="w-full py-3.5 px-6 rounded-xl bg-[#162920] hover:bg-[#1B3B2B] border border-[#1B3B2B] hover:border-[#00A86B] text-white font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
              >
                <span>Download Bond-Portable-x64.exe</span>
                <span className="text-lg">⤓</span>
              </a>
            </div>

          </div>

          {/* Quick Terminal Command & Checksum */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-[#111916] border border-[#1B3B2B] px-4 py-2.5 rounded-xl text-xs font-mono text-[#9CA3AF]">
            <span className="text-[#10B981]">Powershell / Curl:</span>
            <code className="text-white selection:bg-[#00A86B]/40">
              curl -LO https://github.com/Krishna5567/BOND/releases/download/v1.0.0/Bond-Setup-x64.exe
            </code>
            <button
              onClick={copyInstallHint}
              className="px-2.5 py-1 rounded bg-[#162920] hover:bg-[#1B3B2B] text-white border border-[#1B3B2B] text-[11px] transition-all"
            >
              {copiedCmd ? '✓ Copied' : 'Copy'}
            </button>
          </div>

        </div>
      </section>

      {/* KRISHNA TECH CHANNEL SPOTLIGHT BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-gradient-to-r from-[#111916] via-[#162920] to-[#111916] border-2 border-[#1B3B2B] hover:border-[#00A86B] rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-start gap-4">
              {/* YouTube Play Icon Box */}
              <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-500 shadow-inner">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-bold mb-1.5 uppercase tracking-wider">
                  Official Video Tutorial
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Watch Full Setup & Installation on Krishna Tech
                </h2>
                <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 max-w-xl leading-relaxed">
                  Need help installing or configuring Bond? Watch the complete walkthrough on YouTube — covering download, Windows SmartScreen, API key setup, and running multiple AI coding agents.
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-[#10B981] font-semibold">
                  <span>Channel: @krishnatech-ind</span>
                  <span>•</span>
                  <span>Step-by-Step Walkthrough</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider text-center shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Watch Video Guide</span>
                <span>↗</span>
              </a>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-[#111916] hover:bg-[#162920] border border-[#1B3B2B] text-[#9CA3AF] hover:text-white font-semibold text-xs text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Subscribe Channel 🔔</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* PURE VECTOR / CODE TERMINAL SIMULATION (NO SCREENSHOTS) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-[#111916] border border-[#1B3B2B] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Mock Window Titlebar */}
          <div className="bg-[#0a0f0d] border-b border-[#1B3B2B] px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#10b981]/80"></span>
              <span className="ml-3 font-mono text-xs text-[#9CA3AF] tracking-wide">
                Bond AI Terminal Hub — [Operator Theme Default]
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280]">
              <span className="text-[#10B981]">● ConPTY: Active</span>
              <span>|</span>
              <span>120x34</span>
            </div>
          </div>

          {/* Interactive Agent Tabs Selector */}
          <div className="bg-[#162920]/60 border-b border-[#1B3B2B] px-4 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('claude')}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'claude' ? 'border-[#10B981] text-white bg-[#111916]' : 'border-transparent text-[#9CA3AF] hover:text-white'}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
              <span>Agent 1: Claude Code</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#162920] text-[#10B981]">running</span>
            </button>
            <button
              onClick={() => setActiveTab('gemini')}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'gemini' ? 'border-[#10B981] text-white bg-[#111916]' : 'border-transparent text-[#9CA3AF] hover:text-white'}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
              <span>Agent 2: Gemini CLI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#162920] text-[#9CA3AF]">ready</span>
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'fleet' ? 'border-[#10B981] text-white bg-[#111916]' : 'border-transparent text-[#9CA3AF] hover:text-white'}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>Fleet Multi-Grid</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#162920] text-[#10B981]">4x split</span>
            </button>
          </div>

          {/* Terminal Console View */}
          <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed bg-[#0a0f0d] min-h-[300px]">
            {activeTab === 'claude' && (
              <div className="space-y-2">
                <p className="text-[#9CA3AF]">
                  <span className="text-[#10B981]">bond@desktop:~/project</span>
                  <span className="text-[#6B7280]">$</span> claude --dangerously-skip-permissions
                </p>
                <p className="text-[#D97706] font-bold">
                  Claude Code (v1.0.0 · Operator Theme Session)
                </p>
                <p className="text-[#9CA3AF]">
                  ╭─ Connecting to Anthropic API endpoint... <span className="text-[#10B981]">Connected (18ms)</span>
                </p>
                <p className="text-white">
                  │ Task: Refactor auth pipeline and sync Model Context Protocol tools.
                </p>
                <p className="text-[#10B981]">
                  ╰─ ✔ 14 files checked · 0 errors found · Built successfully.
                </p>
                <p className="text-[#9CA3AF] pt-2 flex items-center gap-1.5">
                  <span className="text-[#10B981]">❯</span>
                  <span>Awaiting instructions...</span>
                  <span className="w-2 h-4 bg-[#10B981] animate-pulse"></span>
                </p>
              </div>
            )}

            {activeTab === 'gemini' && (
              <div className="space-y-2">
                <p className="text-[#9CA3AF]">
                  <span className="text-[#10B981]">bond@desktop:~/project</span>
                  <span className="text-[#6B7280]">$</span> gemini-cli analyze --model gemini-2.5-flash
                </p>
                <p className="text-[#3B82F6] font-bold">
                  Google Gemini 2.5 Flash Autonomous Engine (1M Context Active)
                </p>
                <p className="text-[#9CA3AF]">
                  Reading workspace tree... indexed 1,700 project symbols across 42 modules.
                </p>
                <p className="text-emerald-300">
                  Ready to stream reasoning tokens at 180 tok/s.
                </p>
                <p className="text-[#9CA3AF] pt-2 flex items-center gap-1.5">
                  <span className="text-[#10B981]">❯</span>
                  <span>Ask anything about the codebase...</span>
                  <span className="w-2 h-4 bg-[#10B981] animate-pulse"></span>
                </p>
              </div>
            )}

            {activeTab === 'fleet' && (
              <div className="space-y-2">
                <p className="text-[#9CA3AF]">
                  <span className="text-[#10B981]">bond@operator:~$</span> bond fleet --orchestrate --theme operator
                </p>
                <p className="text-[#10B981]">
                  ✔ Terminal 1: Claude 3.7 Sonnet [Active · Coding]
                </p>
                <p className="text-blue-400">
                  ✔ Terminal 2: Gemini 2.5 Flash [Active · Research]
                </p>
                <p className="text-purple-400">
                  ✔ Terminal 3: DeepSeek Reasoning [Active · Math & Verification]
                </p>
                <p className="text-emerald-400">
                  ✔ Terminal 4: PowerShell / Git [Active · Staging Release]
                </p>
                <p className="text-[#9CA3AF] pt-2">
                  All 4 sub-terminals communicating across shared context bus with zero IPC lag.
                </p>
              </div>
            )}
          </div>

          {/* Terminal Bottom Status Ribbon */}
          <div className="bg-[#111916] border-t border-[#1B3B2B] px-5 py-2.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#9CA3AF]">
            <div className="flex items-center gap-4">
              <span>Theme: <strong className="text-white">Operator (Dark Ops)</strong></span>
              <span>Engine: <strong className="text-[#10B981]">Windows ConPTY</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span>Status: <strong className="text-[#10B981]">Ready</strong></span>
              <span>Memory: <strong className="text-white">68 MB</strong></span>
            </div>
          </div>

        </div>
      </section>

      {/* STEP-BY-STEP INSTALLATION INSTRUCTIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162920] border border-[#1B3B2B] text-xs font-bold text-[#10B981] mb-3">
            INSTALLATION GUIDE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How to Install Bond in 4 Easy Steps
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2">
            Follow this clear step-by-step procedure to get Bond running on your Windows machine in under 2 minutes.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 hover:border-[#00A86B] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#006341] text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-[0_0_15px_rgba(0,99,65,0.4)]">
              01
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Download the Windows Setup Installer
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed mb-4">
                Click the <strong className="text-white">Download Bond-Setup-x64.exe</strong> button at the top of this page or download directly from GitHub Releases. The download size is ~145 MB and contains all required binaries, including embedded on-device Whisper models and native C++ runtimes.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={INSTALLER_DOWNLOAD_URL}
                  className="px-4 py-2 rounded-lg bg-[#00A86B] hover:bg-[#10B981] text-black font-bold text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  <span>Download .EXE Installer</span>
                  <span>⤓</span>
                </a>
                <span className="text-xs font-mono text-[#6B7280]">
                  Target: Windows 10 & 11 (64-bit)
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 (SmartScreen Guide) */}
          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 hover:border-[#00A86B] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#006341] text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-[0_0_15px_rgba(0,99,65,0.4)]">
              02
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span>Run the Installer & Windows SmartScreen Info</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#162920] text-[#10B981] border border-[#1B3B2B]">Important</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed mb-4">
                Double-click <code className="text-white font-mono bg-[#162920] px-1.5 py-0.5 rounded">Bond-Setup-x64.exe</code> in your Downloads folder.
              </p>

              {/* SmartScreen helper box */}
              <div className="bg-[#0a0f0d] border border-[#1B3B2B] rounded-xl p-4 text-xs text-[#9CA3AF] space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>If you see "Windows protected your PC":</span>
                </div>
                <p>
                  Because this is an independent open-source release without an expensive corporate signing certificate, Windows Defender SmartScreen may show a blue prompt.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 font-mono text-[11px] pt-1">
                  <span className="bg-[#162920] text-white px-2.5 py-1 rounded border border-[#1B3B2B]">
                    1. Click "More info"
                  </span>
                  <span className="text-[#6B7280]">→</span>
                  <span className="bg-[#006341] text-white px-2.5 py-1 rounded border border-[#00A86B]">
                    2. Click "Run anyway"
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Bond is 100% verified, virus-free, and open-source under Apache-2.0. You can inspect all source code on GitHub anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 hover:border-[#00A86B] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#006341] text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-[0_0_15px_rgba(0,99,65,0.4)]">
              03
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Setup Completes & Launches in Operator Theme
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed mb-3">
                The setup wizard will unpack Bond to your user directory and automatically place a <strong className="text-white">Bond</strong> icon on your Desktop and Start Menu.
              </p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                When launched, Bond immediately starts in the high-contrast <strong className="text-[#10B981]">Operator Dark Ops</strong> theme, with zero eye strain and optimal contrast for code terminals.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 hover:border-[#00A86B] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#006341] text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-[0_0_15px_rgba(0,99,65,0.4)]">
              04
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Configure Your AI Models or Ollama (Optional)
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed mb-3">
                Press <code className="text-white font-mono bg-[#162920] px-1.5 py-0.5 rounded">Ctrl+,</code> or click the Settings gear icon in the top right:
              </p>
              <ul className="text-xs sm:text-sm text-[#9CA3AF] space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">Cloud Frontier Models:</strong> Enter Anthropic, OpenAI, or Google Gemini keys.</li>
                <li><strong className="text-white">Local Privacy Mode (Ollama):</strong> Connect to <code className="text-[#10B981] font-mono">http://localhost:11434</code> to run Llama 3, DeepSeek, or Qwen completely offline.</li>
                <li><strong className="text-white">Custom CLI Agents:</strong> Run any command-line tool directly inside the terminal grid.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* CORE SPECIFICATIONS & SYSTEM REQUIREMENTS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-[#111916] border border-[#1B3B2B] rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>System Requirements & Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-[#0a0f0d] p-4 rounded-xl border border-[#1B3B2B]">
              <span className="text-[#6B7280] block mb-1">OPERATING SYSTEM</span>
              <span className="text-white font-bold">Windows 10 / 11</span>
              <span className="text-[11px] text-[#9CA3AF] block mt-0.5">Build 19041 or higher</span>
            </div>

            <div className="bg-[#0a0f0d] p-4 rounded-xl border border-[#1B3B2B]">
              <span className="text-[#6B7280] block mb-1">ARCHITECTURE</span>
              <span className="text-white font-bold">x64 (64-bit)</span>
              <span className="text-[11px] text-[#9CA3AF] block mt-0.5">Intel / AMD x86_64</span>
            </div>

            <div className="bg-[#0a0f0d] p-4 rounded-xl border border-[#1B3B2B]">
              <span className="text-[#6B7280] block mb-1">MEMORY (RAM)</span>
              <span className="text-white font-bold">4 GB RAM min</span>
              <span className="text-[11px] text-[#9CA3AF] block mt-0.5">8 GB recommended</span>
            </div>

            <div className="bg-[#0a0f0d] p-4 rounded-xl border border-[#1B3B2B]">
              <span className="text-[#6B7280] block mb-1">DISK STORAGE</span>
              <span className="text-white font-bold">~450 MB</span>
              <span className="text-[11px] text-[#9CA3AF] block mt-0.5">SSD recommended</span>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <h3 className="text-2xl font-black text-white tracking-tight mb-6">
          Frequently Asked Questions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-5">
            <h4 className="font-bold text-white text-sm mb-2">
              Is Bond completely free to use?
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Yes, Bond is free and open-source software licensed under Apache-2.0. There are no subscriptions or hidden charges. You bring your own API keys or run free local models with Ollama.
            </p>
          </div>

          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-5">
            <h4 className="font-bold text-white text-sm mb-2">
              Installer vs Portable: Which should I download?
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              If you want automated Desktop and Start Menu shortcuts and full file associations, use the <strong className="text-white">Setup Installer</strong>. If you want zero installation without registry changes, use the <strong className="text-white">Portable</strong> version.
            </p>
          </div>

          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-5">
            <h4 className="font-bold text-white text-sm mb-2">
              How do I get help or tutorials?
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Check out the official video tutorials on the <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="text-[#10B981] hover:underline font-bold">Krishna Tech YouTube channel</a> or open an issue on our GitHub repository.
            </p>
          </div>

          <div className="bg-[#111916] border border-[#1B3B2B] rounded-2xl p-5">
            <h4 className="font-bold text-white text-sm mb-2">
              Why does Windows show a SmartScreen warning?
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Microsoft SmartScreen flags newly published executables until they accumulate global download reputation. Simply click "More info" and then "Run anyway" to proceed safely.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL DOWNLOAD BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-gradient-to-br from-[#162920] to-[#111916] border-2 border-[#00A86B] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_0_40px_rgba(0,168,107,0.18)]">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to Accelerate Your AI Coding Workflow?
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto mb-8 leading-relaxed">
            Download Bond Desktop today and experience unified multi-agent pseudo-terminal execution with the sleek Operator dark ops theme.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={INSTALLER_DOWNLOAD_URL}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00A86B] to-[#10B981] hover:from-[#10B981] hover:to-[#00A86B] text-black font-extrabold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Download Bond-Setup-x64.exe (Installer)</span>
              <span>⤓</span>
            </a>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#111916] hover:bg-[#162920] border border-[#1B3B2B] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Krishna Tech Video Guide ↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1B3B2B] bg-[#0a0f0d] py-10 px-4 sm:px-8 text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-[#10B981] tracking-wider">BOND AI</span>
            <span>•</span>
            <span>Autonomous AI Command Hub</span>
            <span>•</span>
            <span>Apache-2.0 License</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <span>YouTube: Krishna Tech</span>
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={RELEASES_PAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              All Releases
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const MODELS = [
  { id: 'claude', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', badge: 'Available', desc: 'Direct CLI Picker (Autonomous Coding)', status: 'Ready' },
  { id: 'gpt', name: 'GPT-4o / Codex', provider: 'OpenAI', badge: 'Available', desc: 'Full Reasoning & Refactor Harness', status: 'Ready' },
  { id: 'gemini', name: 'Gemini 2.5 Flash', provider: 'Google', badge: 'Available', desc: 'Multimodal 1M Context Engine', status: 'Ready' },
  { id: 'grok', name: 'Grok 3 & DeepSeek', provider: 'xAI / DeepSeek', badge: 'Supported', desc: 'Deep Logic & Math Execution', status: 'Ready' },
];

const SLIDES = [
  {
    num: 1,
    tag: 'SLIDE 1 OF 4',
    title: 'Bond Desktop Workbench',
    subtitle: 'Autonomous Multi-Agent Terminal Hub',
    description: 'Unified multi-model aggregator with direct agent dropdown selector and native OS pseudo-terminals.',
    url: 'https://github.com/Krishna5567/BOND/releases/download/v1.0.0/Bond-Setup-x64.exe',
    rightCardTitle: 'Bond Desktop',
    rightCardBadge: 'PLATFORM #1',
    rightCardDesc: 'Unified multi-agent developer workbench with native terminal grid and instant OS file watchers.',
    checks: [
      { name: 'Low-Latency Real PTY Grids', status: '✓ Ready' },
      { name: 'Right-Side Command Deck', status: '✓ Ready' },
      { name: 'Dual-Pane & Overview Layouts', status: '✓ Ready' },
      { name: 'Model Context Protocol (MCP)', status: '✓ Ready' },
    ],
  },
  {
    num: 2,
    tag: 'SLIDE 2 OF 4',
    title: 'Real ConPTY Terminal Grids',
    subtitle: 'Zero Web-Sandbox Latency',
    description: 'Direct interactive terminals running Claude Code, Gemini CLI, and Bash/PowerShell side-by-side.',
    url: 'https://github.com/Krishna5567/BOND',
    rightCardTitle: 'Terminal Grid Engine',
    rightCardBadge: 'ARCHITECTURE #2',
    rightCardDesc: 'Executes agents in native Windows ConPTY / Mac PTY sessions with zero webview middleman.',
    checks: [
      { name: 'Interactive ANSI & Key Bindings', status: '✓ Ready' },
      { name: 'OSC Escape Window Signals', status: '✓ Ready' },
      { name: 'Instant File Drop Peeks', status: '✓ Ready' },
      { name: 'Sub-millisecond Typing Latency', status: '✓ Ready' },
    ],
  },
  {
    num: 3,
    tag: 'SLIDE 3 OF 4',
    title: 'Command Deck & Right Slidebar',
    subtitle: 'Streamlined Workspace Control',
    description: 'Slidebar positioned on the right with Dispatch Agent, Fleet Models, and complete slidebar hide options.',
    url: 'https://github.com/Krishna5567/BOND',
    rightCardTitle: 'Command Deck',
    rightCardBadge: 'WORKSPACE #3',
    rightCardDesc: 'Quickly toggle layout modes, switch themes, and hide the slidebar with Ctrl+B for focused full-screen editing.',
    checks: [
      { name: 'Overview / Dual-Pane Toggle', status: '✓ Ready' },
      { name: 'One-Click Slidebar Collapse', status: '✓ Ready' },
      { name: 'Active Fleet Session Tabs', status: '✓ Ready' },
      { name: 'Workspace File Explorer', status: '✓ Ready' },
    ],
  },
  {
    num: 4,
    tag: 'SLIDE 4 OF 4',
    title: 'Model Context Protocol (MCP)',
    subtitle: 'Extensible Tool Ecosystem',
    description: 'Native MCP client connecting your desktop agents to databases, GitHub, filesystem, and custom tools.',
    url: 'https://github.com/Krishna5567/BOND',
    rightCardTitle: 'MCP Extension Hub',
    rightCardBadge: 'ECOSYSTEM #4',
    rightCardDesc: 'Install community MCP servers or write custom Python/TypeScript tool integrations effortlessly.',
    checks: [
      { name: 'PostgreSQL / SQLite Tools', status: '✓ Ready' },
      { name: 'GitHub Issue & PR Helpers', status: '✓ Ready' },
      { name: '.mcpb Package Installer', status: '✓ Ready' },
      { name: 'Shared Tool Fan-Out to All Agents', status: '✓ Ready' },
    ],
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'directory' | 'specs'>('directory');
  const [screenshotMode, setScreenshotMode] = useState<'expanded' | 'collapsed'>('expanded');

  const slide = SLIDES[activeSlide];

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-800 font-sans selection:bg-[#00A86B]/20 selection:text-[#004D2C]">
      
      {/* Top Banner Navigation (matching reference layout) */}
      <header className="sticky top-0 z-40 bg-[#F4F7F5]/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Logo Badge */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-[#004D2C] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                B
              </div>
              <span className="font-extrabold text-sm tracking-wide text-[#004D2C]">BOND</span>
              <div className="w-1.5 h-4 bg-[#00A86B] rounded-full"></div>
            </div>
            
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-900 tracking-tight">AI Platform Index & Command Hub</span>
              <span className="text-[10px] text-slate-500">Autonomous desktop terminal workbench: Native execution & supported frontier models</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${activeTab === 'directory' ? 'bg-[#004D2C] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
            >
              Slide-by-Slide
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${activeTab === 'specs' ? 'bg-[#004D2C] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
            >
              Comparison Table
            </button>
            <a 
              href="#download" 
              className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full bg-[#00A86B] hover:bg-[#00915c] text-white shadow-sm transition-all"
            >
              <span>Download .EXE</span>
              <span>⤓</span>
            </a>
          </div>
        </div>
      </header>

      {/* Target Models Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pl-1">
            <span className="text-[#00A86B]">✦</span>
            <span>Primary Target Models:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-[#141D17] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#34D399] pulse-dot"></span>
              <span>Claude 3.7 Sonnet</span>
            </div>
            <div className="flex items-center gap-2 bg-[#141D17] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#34D399]"></span>
              <span>GPT-4o / Codex</span>
            </div>
            <div className="flex items-center gap-2 bg-[#141D17] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              <span>Gemini 2.5 Flash</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[#141D17] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]"></span>
              <span>Grok 3 & DeepSeek</span>
            </div>
          </div>
        </div>
      </section>

      {/* Slide Pagination & Navigation Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, idx) => (
              <button
                key={s.num}
                onClick={() => setActiveSlide(idx)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${activeSlide === idx ? 'bg-[#141D17] text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                {s.num}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1))}
              className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold"
            >
              ←
            </button>
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
              Slide {activeSlide + 1} of {SLIDES.length}
            </div>
            <button
              onClick={() => setActiveSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0))}
              className="w-8 h-8 rounded-full bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Main Showcase Card (Matching the Reference Image Layout Exactly) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Left Container (White Card Section) */}
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
            <div>
              {/* Header inside card */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center font-extrabold text-xl text-[#004D2C] shadow-inner">
                  BD
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{slide.title}</span>
                  </h2>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold border border-slate-200">
                    {slide.tag}
                  </span>
                </div>
              </div>

              {/* Download / Website Link Box */}
              <div className="bg-[#F8FAF9] rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    OFFICIAL DESKTOP INSTALLER LINK
                  </span>
                  <p className="text-xs font-mono text-slate-600 truncate bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                    {slide.url}
                  </p>
                </div>
                <a
                  href="#download"
                  className="px-5 py-2.5 bg-[#004D2C] hover:bg-[#00381F] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
                >
                  <span>Download .EXE</span>
                  <span>⤓</span>
                </a>
              </div>

              {/* Supported Models Grid (Matching Reference Image Style) */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-3">
                  <span>Supported Agent Runtimes</span>
                  <span className="text-slate-400 text-[11px]">Frontier & Standard</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MODELS.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 border-l-4 border-l-[#004D2C] shadow-sm flex items-center justify-between gap-2 hover:border-slate-300 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{m.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${m.badge === 'Available' ? 'bg-[#141D17] text-white' : 'bg-[#E8F5E9] text-[#004D2C] border border-[#C8E6C9]'}`}>
                        {m.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom summary indicator */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: Production Release v1.0.0</span>
              <span className="text-[#00A86B] font-semibold">● Real ConPTY Active</span>
            </div>
          </div>

          {/* Right Container (Signature Dark Forest Green Card Section) */}
          <div className="lg:col-span-4 bg-[#004D2C] p-6 sm:p-8 text-white flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[11px] font-extrabold tracking-wider uppercase text-emerald-200 mb-6">
                {slide.rightCardBadge}
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                {slide.rightCardTitle}
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
                {slide.rightCardDesc}
              </p>

              {/* Capabilities Checklist */}
              <div className="mb-6">
                <div className="inline-block px-2.5 py-1 bg-black/20 rounded-md text-[10px] font-bold tracking-wider uppercase text-emerald-300 mb-3">
                  FEATURE & ARCHITECTURE CHECK
                </div>

                <div className="space-y-2.5">
                  {slide.checks.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-emerald-800/40">
                      <span className="text-emerald-100">{c.name}</span>
                      <span className="font-bold text-white">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Large Call-To-Action Button */}
            <div>
              <a
                href="#download"
                className="w-full py-3 px-4 bg-[#00A86B] hover:bg-[#00915c] text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span>Download for Windows (.exe)</span>
                <span>↗</span>
              </a>
              <span className="block text-center text-[10px] text-emerald-200/60 mt-2">
                Free & Open Source · 64-bit Windows 10 & 11
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Application Screenshots Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Live Interface Preview</span>
                <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#004D2C] rounded text-[10px] font-bold border border-[#C8E6C9]">Real App Capture</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Inspect the newly re-architected right-side Command Deck and full-screen collapsed view.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setScreenshotMode('expanded')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${screenshotMode === 'expanded' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Command Deck (Right Slidebar)
              </button>
              <button
                onClick={() => setScreenshotMode('collapsed')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${screenshotMode === 'collapsed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Maximized Canvas (Collapsed)
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-950 aspect-[16/10] max-h-[560px]">
            <img
              src={screenshotMode === 'expanded' ? '/assets/bond-slidebar-right.png' : '/assets/bond-slidebar-collapsed.png'}
              alt="Bond Desktop Live Interface"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Download Section with Options */}
      <section id="download" className="max-w-7xl mx-auto px-4 sm:px-8 py-8 scroll-mt-20">
        <div className="bg-[#141D17] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#004D2C] text-emerald-300 text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#34D399] pulse-dot"></span>
              <span>OFFICIAL DOWNLOAD HUB</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Download Bond Desktop for Windows
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed mb-8">
              Get the complete multi-agent terminal workbench with native pseudo-terminal execution, deep filesystem synchronization, and local speech-to-text dictation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Installer Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/10 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Recommended</span>
                    <span className="text-[10px] text-slate-400">Windows 10 / 11</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Standard Installer (.exe)</h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Full setup wizard. Automatically registers Desktop and Start Menu shortcuts.
                  </p>
                </div>
                <a
                  href="https://github.com/Krishna5567/BOND/releases/download/v1.0.0/Bond-Setup-x64.exe"
                  className="w-full py-2.5 px-4 bg-[#00A86B] hover:bg-[#00915c] text-white text-xs font-bold rounded-xl text-center shadow transition-all block"
                  download
                >
                  Download .EXE Installer
                </a>
              </div>

              {/* Portable / Zip Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/10 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Zero Install</span>
                    <span className="text-[10px] text-slate-400">Portable</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Portable Directory (.zip)</h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Run Bond directly from any USB drive or folder without touching the registry.
                  </p>
                </div>
                <a
                  href="https://github.com/Krishna5567/BOND/releases"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl text-center border border-white/10 transition-all block"
                >
                  Browse Releases on GitHub ↗
                </a>
              </div>
            </div>

            {/* SmartScreen note */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-slate-300">
              <span className="font-bold text-white">💡 Note for Windows Users:</span> If you see a blue screen saying <span className="italic text-emerald-300">"Windows protected your PC"</span>, simply click <span className="font-bold text-white">"More info"</span> and then <span className="font-bold text-white">"Run anyway"</span>. Bond is safe, open-source software built on Electron.
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Setup Instructions for Users */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
              How to Publish & Host on GitHub for Free
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Follow these three quick steps to push this desktop app to your GitHub repository and distribute the installer worldwide for $0/month.
            </p>

            <div className="space-y-4">
              <div className="bg-[#F8FAF9] p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-black text-[#004D2C] block mb-1">Step 1: Push Code to Your GitHub Repo</span>
                <pre className="text-xs font-mono bg-slate-900 text-emerald-300 p-3 rounded-lg overflow-x-auto">
{`cd c:\\Users\\KRISHNA\\OneDrive\\Desktop\\csv\\bond-desktop
git remote add origin https://github.com/YOUR_USERNAME/bond-desktop.git
git push -u origin main`}
                </pre>
              </div>

              <div className="bg-[#F8FAF9] p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-black text-[#004D2C] block mb-1">Step 2: Create a Release and Attach the .EXE</span>
                <p className="text-xs text-slate-600 mb-2">
                  In your GitHub repository, navigate to <strong>Releases → Draft a new release</strong>. Create tag <code>v1.0.0</code> and drag and drop your built <code>Bond-Setup-x64.exe</code> into the release assets area.
                </p>
                <div className="text-[11px] text-[#004D2C] font-semibold">
                  GitHub will host the download file on Microsoft CDN with unlimited free bandwidth.
                </div>
              </div>

              <div className="bg-[#F8FAF9] p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-black text-[#004D2C] block mb-1">Step 3: Deploy this Website to Vercel (1-Click)</span>
                <p className="text-xs text-slate-600">
                  Connect your GitHub repo to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#00A86B] underline font-bold">Vercel</a> or Cloudflare Pages. It will build and host your landing page live on the web for free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#004D2C]">BOND</span>
            <span>·</span>
            <span>Autonomous AI Command Hub</span>
            <span>·</span>
            <span>Apache-2.0 License</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">
              GitHub
            </a>
            <a href="#download" className="hover:text-slate-900 transition-colors">
              Downloads
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

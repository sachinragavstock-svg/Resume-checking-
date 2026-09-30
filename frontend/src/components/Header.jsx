import React from 'react';
import { Cpu, Terminal, BarChart3, Layers, Sparkles, Play, ShieldCheck } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onTryDemo, isAnalyzing }) {
  const navItems = [
    { id: 'analyzer', label: 'Live Match Engine', icon: Cpu, badge: 'Live Pipeline' },
    { id: 'dsa_lab', label: 'Interactive DSA Lab', icon: Terminal, badge: '6 Algorithms' },
    { id: 'benchmark', label: 'Performance Lab', icon: BarChart3, badge: 'Real Timings' },
    { id: 'architecture', label: 'System Architecture', icon: Layers, badge: '7-Layer' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c14]/85 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                ResumeIQ
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                DSA v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Deterministic DSA Match Engine & Algorithm Lab
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTryDemo}
            disabled={isAnalyzing}
            className="btn-demo px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Load Section 20 Realistic Sample & Run Pipeline"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>⚡ Try Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}

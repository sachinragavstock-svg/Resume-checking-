import React, { useState } from 'react';
import { Hash, GitBranch, Search, Binary, Grid, Sliders, FlaskConical } from 'lucide-react';
import HashMapLab from './HashMapLab';
import TrieLab from './TrieLab';
import KmpLab from './KmpLab';
import RabinKarpLab from './RabinKarpLab';
import EditDistanceLab from './EditDistanceLab';
import RankingLab from './RankingLab';

const LAB_TABS = [
  { id: 'hashmap', label: 'HASHMAP', icon: Hash, complexity: 'O(1) Avg Lookup', desc: 'Separate Chaining & Polynomial Hash' },
  { id: 'trie', label: 'TRIE', icon: GitBranch, complexity: 'O(L) Prefix Search', desc: 'Prefix Tree & Autocomplete' },
  { id: 'kmp', label: 'KMP', icon: Search, complexity: 'O(n + m)', desc: 'LPS Jump Tables & Linear Search' },
  { id: 'rabin_karp', label: 'RABIN-KARP', icon: Binary, complexity: 'O(n + m) Expected', desc: 'Rolling Hash & Collision Verify' },
  { id: 'edit_distance', label: 'EDIT DISTANCE', icon: Grid, complexity: 'O(n × m)', desc: 'Dynamic Programming Matrix' },
  { id: 'ranking', label: 'RANKING', icon: Sliders, complexity: 'O(k log k)', desc: 'Priority Heap & Weighted Math' },
];

export default function DsaLabView() {
  const [activeLabTab, setActiveLabTab] = useState('hashmap');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Laboratory Banner */}
      <div className="glass-panel p-6 border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-indigo-500/40 text-cyan-300">
              <FlaskConical className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-100">
                  Interactive DSA Laboratory
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                  Developer Playground
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live step-by-step visualizations, pointer transitions, state inspection, and complexity proofs for all 6 core algorithms.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tab Selector Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6 pt-4 border-t border-white/10">
          {LAB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLabTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveLabTab(tab.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-b from-indigo-950/90 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400 -translate-y-0.5'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">{tab.complexity}</span>
                </div>
                <div>
                  <h4 className={`text-xs font-heading font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {tab.label}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lab Component */}
      <div>
        {activeLabTab === 'hashmap' && <HashMapLab />}
        {activeLabTab === 'trie' && <TrieLab />}
        {activeLabTab === 'kmp' && <KmpLab />}
        {activeLabTab === 'rabin_karp' && <RabinKarpLab />}
        {activeLabTab === 'edit_distance' && <EditDistanceLab />}
        {activeLabTab === 'ranking' && <RankingLab />}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Layers, ArrowDown, ChevronRight, FileText, Filter, Hash, GitBranch, Search, Binary, Grid, Sliders, Award, CheckCircle2 } from 'lucide-react';

const ARCHITECTURE_LAYERS = [
  {
    id: 'layer-1',
    name: '1. RESUME & JOB INPUT',
    icon: FileText,
    color: '#38bdf8',
    summary: 'Document parsing of PDF, DOCX, TXT, and raw text streams.',
    details: 'Uses pdfplumber and pypdfium2 to extract clean text streams without losing structural token markers.'
  },
  {
    id: 'layer-2',
    name: '2. TEXT EXTRACTION & TOKENIZATION',
    icon: Filter,
    color: '#818cf8',
    summary: 'Token splitting, n-gram extraction, stopword filtering, and punctuation trimming.',
    details: 'Converts raw sentences into normalized token sequences and candidate skill n-grams (1-gram to 3-grams).'
  },
  {
    id: 'layer-3',
    name: '3. TEXT NORMALIZATION & ALIAS MAPPING',
    icon: Filter,
    color: '#a855f7',
    summary: 'Deterministic taxonomy resolving aliases (React.js → React, K8s → Kubernetes, etc.).',
    details: 'Ensures synonyms, framework variants, and abbreviations map to canonical skill identifiers prior to indexing.'
  },
  {
    id: 'layer-4',
    name: '4. DUAL INDEXING: HASHMAP & TRIE',
    icon: Hash,
    color: '#06b6d4',
    branches: [
      { name: 'Custom HashMap', time: 'O(1) Avg Lookup', role: 'Frequency table & instant direct key lookups with separate chaining' },
      { name: 'Custom Trie (Prefix Tree)', time: 'O(L) Path Search', role: 'Hierarchical character tree for prefix searches and multi-word skills' }
    ],
    summary: 'Fast exact and prefix matching in memory.',
    details: 'Parallel structural indexing providing both instant O(1) frequency lookup and O(L) prefix exploration.'
  },
  {
    id: 'layer-5',
    name: '5. ADVANCED STRING MATCHING ENGINE',
    icon: Search,
    color: '#f59e0b',
    branches: [
      { name: 'Knuth-Morris-Pratt (KMP)', time: 'O(N + M)', role: 'Linear substring search utilizing LPS failure function tables' },
      { name: 'Rabin-Karp Algorithm', time: 'O(N + M) Exp', role: 'Polynomial rolling hash sliding window with collision verification' },
      { name: 'DP Levenshtein Edit Distance', time: 'O(N × M)', role: 'Dynamic programming matrix for typo tolerance & fuzzy matching' }
    ],
    summary: 'Multi-algorithm substring verification and typo tolerance.',
    details: 'Executes KMP and Rabin-Karp to find exact occurrences in context, followed by DP Edit Distance for fuzzy spelling matching.'
  },
  {
    id: 'layer-6',
    name: '6. REQUIREMENT WEIGHTING & RANKING',
    icon: Sliders,
    color: '#10b981',
    summary: 'Priority Max-Heap (O(K log K)) and category weight attribution.',
    details: 'Assigns importance points (e.g. 10 pts for Core, 5 pts for Preferred) and computes (Matched Weight / Total Weight) * 100.'
  },
  {
    id: 'layer-7',
    name: '7. MATCH ENGINE & VISUAL REPORT',
    icon: Award,
    color: '#ec4899',
    summary: 'Final percentage, Battle View matrix, and explainability breakdown.',
    details: 'Generates the final explainable audit report, side-by-side battle matrix, and transparent algorithmic logs.'
  }
];

export default function ArchitectureView() {
  const [selectedLayer, setSelectedLayer] = useState(ARCHITECTURE_LAYERS[3]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title Header */}
      <div className="glass-panel p-6 border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-indigo-500/40 text-cyan-300">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-100">
                End-to-End System Architecture
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                Real Code Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive 7-layer pipeline visualizing the exact deterministic flow from raw document ingestion to score audit.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layer Flow Diagram */}
        <div className="lg:col-span-2 space-y-3 font-mono">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const Icon = layer.icon;
            const isSelected = selectedLayer.id === layer.id;

            return (
              <React.Fragment key={layer.id}>
                {idx > 0 && (
                  <div className="flex justify-center my-0.5">
                    <ArrowDown className="w-4 h-4 text-slate-600" />
                  </div>
                )}

                <div
                  onClick={() => setSelectedLayer(layer)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400 -translate-y-0.5'
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-heading font-bold text-sm text-slate-100">
                        {layer.name}
                      </h3>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>

                  <p className="text-xs text-slate-400 ml-10 mb-2">
                    {layer.summary}
                  </p>

                  {/* If layer has branch chips */}
                  {layer.branches && (
                    <div className="flex flex-wrap gap-2 ml-10 pt-2 border-t border-slate-800/60">
                      {layer.branches.map((b, bi) => (
                        <div
                          key={bi}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex items-center gap-1.5"
                        >
                          <span className="text-white font-bold">{b.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono">
                            {b.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Layer Deep-Dive Inspector Panel */}
        <div className="glass-panel p-6 border border-white/10 rounded-2xl flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="pb-3 mb-4 border-b border-white/10 flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Layer Inspector</span>
                <h4 className="font-heading font-bold text-sm text-white">{selectedLayer.name}</h4>
              </div>
            </div>

            <div className="space-y-4 text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block mb-1">Architecture Role</span>
                <p className="text-xs leading-relaxed text-slate-200">
                  {selectedLayer.details}
                </p>
              </div>

              {selectedLayer.branches && (
                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] uppercase block">Sub-Algorithms in this Layer:</span>
                  {selectedLayer.branches.map((b, bi) => (
                    <div key={bi} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">{b.name}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">{b.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{b.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-slate-300 text-[11px] leading-relaxed">
            💡 <strong>100% Deterministic Engine:</strong> ResumeIQ does not query external opaque AI APIs for scoring. All matching math is calculated with verifiable Python DSA data structures.
          </div>
        </div>
      </div>
    </div>
  );
}

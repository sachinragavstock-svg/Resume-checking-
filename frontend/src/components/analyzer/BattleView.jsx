import React, { useState } from 'react';
import { Swords, Check, X, AlertTriangle, Sparkles, Filter, Shield, HelpCircle } from 'lucide-react';

export default function BattleView({ battleItems }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!battleItems || battleItems.length === 0) return null;

  const filters = [
    { id: 'ALL', label: 'ALL', count: battleItems.length },
    { id: 'MATCHED', label: 'MATCHED 🟢', count: battleItems.filter(b => b.status === 'MATCHED').length },
    { id: 'MISSING', label: 'MISSING 🔴', count: battleItems.filter(b => b.status === 'MISSING').length },
    { id: 'PARTIAL', label: 'PARTIAL 🟠', count: battleItems.filter(b => b.status === 'PARTIAL').length },
    { id: 'REQUIRED', label: 'REQUIRED', count: battleItems.filter(b => b.job_has).length },
  ];

  const filteredItems = battleItems.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'MATCHED') return item.status === 'MATCHED';
    if (activeFilter === 'MISSING') return item.status === 'MISSING';
    if (activeFilter === 'PARTIAL') return item.status === 'PARTIAL';
    if (activeFilter === 'REQUIRED') return item.job_has === true;
    return true;
  });

  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl relative my-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 text-rose-400 border border-rose-500/30">
            <Swords className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-100">
                Resume vs Job "Battle View"
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Side-by-Side Matrix
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct combat alignment between candidate profile skills and target role requirements.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{f.label}</span>
              <span className="ml-1.5 text-[10px] opacity-75">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Battle Table Matrix */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 shadow-xl">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] border-b border-slate-800">
            <tr>
              <th className="p-4 w-1/3">Skill / Requirement</th>
              <th className="p-4 text-center w-28 bg-indigo-950/30 border-x border-slate-800 text-indigo-300 font-bold">
                RESUME
              </th>
              <th className="p-4 text-center w-28 bg-cyan-950/30 border-r border-slate-800 text-cyan-300 font-bold">
                JOB
              </th>
              <th className="p-4 text-center w-36">Category</th>
              <th className="p-4">Classification & Attribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.map((item, idx) => {
              const isMatched = item.status === 'MATCHED';
              const isPartial = item.status === 'PARTIAL';
              const isMissing = item.status === 'MISSING';
              const isNotRelevant = item.status === 'NOT_RELEVANT';

              return (
                <tr
                  key={idx}
                  className="hover:bg-slate-900/50 transition-colors duration-150"
                  style={{ animation: `fadeIn 0.3s ease-out ${idx * 0.04}s forwards` }}
                >
                  {/* Skill Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-100 text-sm">{item.skill}</span>
                    </div>
                  </td>

                  {/* Resume Column Status */}
                  <td className="p-4 text-center bg-indigo-950/20 border-x border-slate-800/80">
                    {item.resume_has ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-slate-600 border border-slate-800">
                        —
                      </span>
                    )}
                  </td>

                  {/* Job Column Status */}
                  <td className="p-4 text-center bg-cyan-950/20 border-r border-slate-800/80">
                    {item.job_has ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-slate-600 border border-slate-800">
                        —
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="p-4 text-center text-slate-400 text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 inline-block">
                      {item.category || 'General'}
                    </span>
                  </td>

                  {/* Classification Tag & Details */}
                  <td className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isMatched && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            MATCHED
                          </span>
                        )}
                        {isPartial && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            PARTIAL
                          </span>
                        )}
                        {isMissing && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            MISSING
                          </span>
                        )}
                        {isNotRelevant && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/40 text-slate-300 border border-slate-600/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            NOT RELEVANT (EXTRA)
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 truncate max-w-xs">{item.method}</span>
                      </div>

                      {item.job_has && (
                        <span className="text-[11px] text-cyan-300 font-bold shrink-0">
                          +{item.contribution} pts
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { FileCode2, CheckSquare2, TrendingUp, Sparkles, AlertCircle, ArrowUpRight, Cpu } from 'lucide-react';

export default function TechnicalReport({ reportData }) {
  if (!reportData) return null;

  const {
    overall_match,
    required_skills_match,
    preferred_skills_match,
    keyword_coverage,
    matched_requirements_count,
    missing_requirements_count,
    partial_matches_count,
    algorithms_used,
    execution_time_ms
  } = reportData;

  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl relative my-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-100">
                Technical Audit & Algorithmic Report
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                RESUMEIQ v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic scoring telemetry, computational complexity checklist, and skill optimization audit.
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
          Execution Latency: <strong className="text-cyan-300">{execution_time_ms} ms</strong>
        </div>
      </div>

      {/* Primary KPI Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-mono">
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">Overall Match</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-cyan-300 font-heading">{overall_match}%</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Deterministic</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: `${overall_match}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">Required Skills</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-heading">{required_skills_match}%</span>
            <span className="text-[10px] text-slate-400">High Weight</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${required_skills_match}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">Preferred Skills</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-indigo-300 font-heading">{preferred_skills_match}%</span>
            <span className="text-[10px] text-slate-400">Bonus Weight</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${preferred_skills_match}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">Keyword Coverage</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-purple-300 font-heading">{keyword_coverage}%</span>
            <span className="text-[10px] text-slate-400">Taxonomy</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: `${keyword_coverage}%` }} />
          </div>
        </div>
      </div>

      {/* Requirement Counts Row */}
      <div className="grid grid-cols-3 gap-4 mb-6 font-mono text-center">
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 uppercase tracking-wider block mb-1">Matched Requirements</span>
          <span className="text-2xl font-extrabold text-emerald-300">{matched_requirements_count}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <span className="text-xs text-amber-400 uppercase tracking-wider block mb-1">Partial Matches</span>
          <span className="text-2xl font-extrabold text-amber-300">{partial_matches_count}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30">
          <span className="text-xs text-rose-400 uppercase tracking-wider block mb-1">Missing Requirements</span>
          <span className="text-2xl font-extrabold text-rose-300">{missing_requirements_count}</span>
        </div>
      </div>

      {/* Algorithms Used & Complexity Breakdown */}
      <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare2 className="w-4 h-4 text-cyan-400" />
          <h4 className="font-heading font-semibold text-sm text-slate-200">
            Algorithms Employed in This Evaluation
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {algorithms_used && algorithms_used.map((alg, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> {alg.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                  {alg.complexity}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {alg.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

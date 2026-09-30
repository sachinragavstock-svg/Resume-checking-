import React from 'react';
import { X, CheckCircle, Hash, GitBranch, Search, Sliders, FileText, Filter, Award, Activity } from 'lucide-react';

export default function StageDetailsModal({ stage, onClose }) {
  if (!stage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="glass-modal w-full max-w-3xl max-h-[85vh] rounded-2xl border border-indigo-500/30 overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                  Stage {stage.stage_id} Inspector
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  {stage.status}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-100">
                {stage.stage_name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with stage-specific deep-dive */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-slate-300 leading-relaxed">
              {stage.description}
            </p>
          </div>

          {/* STAGE 1: TEXT EXTRACTION */}
          {stage.stage_id === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h4 className="font-heading font-semibold text-cyan-300 text-sm mb-3">Resume Document Metrics</h4>
                  <div className="grid grid-cols-3 gap-2 font-mono text-center">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Characters</span>
                      <span className="text-sm font-bold text-white">{stage.resume_stats.characters}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Words</span>
                      <span className="text-sm font-bold text-emerald-400">{stage.resume_stats.words}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Lines</span>
                      <span className="text-sm font-bold text-indigo-300">{stage.resume_stats.lines}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2.5 rounded bg-slate-900/50 border border-slate-800/80 text-[11px] font-mono text-slate-400 max-h-28 overflow-y-auto">
                    {stage.resume_stats.sample_snippet}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <h4 className="font-heading font-semibold text-indigo-300 text-sm mb-3">Job Description Metrics</h4>
                  <div className="grid grid-cols-3 gap-2 font-mono text-center">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Characters</span>
                      <span className="text-sm font-bold text-white">{stage.job_stats.characters}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Words</span>
                      <span className="text-sm font-bold text-emerald-400">{stage.job_stats.words}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Lines</span>
                      <span className="text-sm font-bold text-indigo-300">{stage.job_stats.lines}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2.5 rounded bg-slate-900/50 border border-slate-800/80 text-[11px] font-mono text-slate-400 max-h-28 overflow-y-auto">
                    {stage.job_stats.sample_snippet}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: TEXT NORMALIZATION */}
          {stage.stage_id === 2 && (
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-cyan-300 text-sm">Alias Normalization Mappings Detected</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase">
                    <tr>
                      <th className="p-3">Raw Token / Term</th>
                      <th className="p-3">Normalized Canonical Skill</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Occurrences</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {stage.alias_mappings_found && stage.alias_mappings_found.length > 0 ? (
                      stage.alias_mappings_found.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/50">
                          <td className="p-3 text-rose-300 font-medium">{item.original}</td>
                          <td className="p-3 text-emerald-400 font-bold">→ {item.normalized}</td>
                          <td className="p-3 text-slate-400">{item.category}</td>
                          <td className="p-3 text-right text-cyan-300 font-bold">{item.occurrences}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500">
                          Direct standard tokenization applied.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 3: KEYWORD FREQUENCY HASHMAP */}
          {stage.stage_id === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-semibold text-cyan-300 text-sm">Resume Keyword Frequency Table (HashMap)</h4>
                <span className="font-mono text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  {stage.time_complexity}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 font-mono">
                {stage.top_frequencies && stage.top_frequencies.map((freq, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-200 font-medium">{freq.key}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                      {freq.frequency}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="font-heading font-semibold text-xs text-slate-400 mb-2">Chaining Hash Buckets (Internal Array Snapshot)</h5>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {stage.buckets_preview && stage.buckets_preview.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="text-indigo-400 font-bold w-20">Bucket [{b.bucket_index}]:</span>
                      {b.nodes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {b.nodes.map((node, ni) => (
                            <span key={ni} className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                              {node.key} ({node.value})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">empty bucket</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: TRIE SEARCH */}
          {stage.stage_id === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-semibold text-cyan-300 text-sm">Trie (Prefix Tree) Traversal Traces</h4>
                <span className="font-mono text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  Search Complexity: {stage.time_complexity}
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {stage.search_traces && stage.search_traces.map((trace, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${trace.found ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="font-bold text-white text-sm">{trace.skill}</span>
                    </div>
                    <div className="text-cyan-300 font-semibold bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      {trace.path}
                    </div>
                    <span className="text-[11px] text-slate-400">{trace.time_complexity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 5: STRING MATCHING & FUZZY */}
          {stage.stage_id === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-semibold text-cyan-300 text-sm">Deterministic Substring & Fuzzy Algorithms</h4>
                <div className="flex gap-2">
                  {stage.algorithms_applied && stage.algorithms_applied.map((alg, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono border border-slate-700">
                      {alg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <h5 className="text-slate-400 text-xs mb-2">KMP & Rabin-Karp Direct Text Matches</h5>
                  {stage.string_matches && stage.string_matches.length > 0 ? (
                    <div className="space-y-1.5">
                      {stage.string_matches.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-emerald-400 font-bold">{m.skill}</span>
                          <span className="text-slate-400">Algorithm: <strong className="text-cyan-300">{m.method}</strong> ({m.matches_count} matches)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">All direct skills matched via O(1) HashMap / O(L) Trie indexing.</p>
                  )}
                </div>

                {stage.edit_distance_checks && stage.edit_distance_checks.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <h5 className="text-slate-400 text-xs mb-2">Dynamic Programming Levenshtein Distance (Typo Tolerance)</h5>
                    <div className="space-y-1.5">
                      {stage.edit_distance_checks.map((ed, i) => (
                        <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-300">
                          <strong>{ed.name}:</strong> {ed.matching_method}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 6: REQUIREMENT WEIGHTS */}
          {stage.stage_id === 6 && (
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-cyan-300 text-sm">Mathematical Weight Attribution & Heap Ranking</h4>
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="text-center font-mono">
                  <span className="text-slate-400 text-xs block mb-1">Scoring Formula</span>
                  <span className="text-lg font-bold text-cyan-300 bg-indigo-950/80 px-4 py-2 rounded-xl border border-indigo-500/40 inline-block">
                    {stage.formula}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-900 text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Skill</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Weight</th>
                      <th className="p-3 text-right">Points Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {stage.ranked_skills_preview && stage.ranked_skills_preview.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="p-3 text-indigo-400 font-bold">#{r.rank}</td>
                        <td className="p-3 text-white font-medium">{r.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === 'MATCHED' ? 'bg-emerald-500/20 text-emerald-300' :
                            r.status === 'PARTIAL' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-right text-slate-300">{r.weight} pts</td>
                        <td className="p-3 text-right text-cyan-300 font-bold">{r.contribution} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STAGE 7: MATCH SCORE */}
          {stage.stage_id === 7 && (
            <div className="space-y-4 font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Overall Score</span>
                  <span className="text-xl font-bold text-cyan-300">{stage.final_score}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Matched Skills</span>
                  <span className="text-xl font-bold text-emerald-400">{stage.matched_count}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Missing Skills</span>
                  <span className="text-xl font-bold text-rose-400">{stage.missing_count}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Execution Time</span>
                  <span className="text-xl font-bold text-indigo-300">{stage.execution_time_ms} ms</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

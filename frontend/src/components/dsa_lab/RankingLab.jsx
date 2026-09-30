import React, { useState } from 'react';
import { Sliders, RefreshCw, BarChart2, TrendingUp, Layers, CheckCircle2, XCircle } from 'lucide-react';

const INITIAL_SKILLS = [
  { name: 'Python', category: 'Languages', status: 'MATCHED', weight: 10 },
  { name: 'Java', category: 'Languages', status: 'MATCHED', weight: 8 },
  { name: 'React', category: 'Frontend', status: 'MATCHED', weight: 7 },
  { name: 'AWS', category: 'Cloud & DevOps', status: 'MISSING', weight: 10 },
  { name: 'Docker', category: 'Cloud & DevOps', status: 'MISSING', weight: 5 },
  { name: 'SQL', category: 'Databases', status: 'MATCHED', weight: 8 },
  { name: 'Kubernetes', category: 'Cloud & DevOps', status: 'PARTIAL', weight: 6 },
  { name: 'Machine Learning', category: 'AI / ML', status: 'MATCHED', weight: 6 },
];

export default function RankingLab() {
  const [skills, setSkills] = useState(INITIAL_SKILLS);

  const handleWeightChange = (index, newWeight) => {
    const updated = [...skills];
    updated[index].weight = parseFloat(newWeight) || 0;
    setSkills(updated);
  };

  const handleStatusToggle = (index) => {
    const updated = [...skills];
    const curr = updated[index].status;
    updated[index].status = curr === 'MATCHED' ? 'PARTIAL' : curr === 'PARTIAL' ? 'MISSING' : 'MATCHED';
    setSkills(updated);
  };

  const handleReset = () => {
    setSkills(INITIAL_SKILLS);
  };

  // Compute live scores and ranking heap
  let totalWeight = 0;
  let matchedWeight = 0;

  skills.forEach(s => {
    totalWeight += s.weight;
    if (s.status === 'MATCHED') matchedWeight += s.weight * 1.0;
    else if (s.status === 'PARTIAL') matchedWeight += s.weight * 0.5;
  });

  const overallScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 1000) / 10 : 0;

  // Max-Heap sorted list
  const rankedSkills = [...skills].sort((a, b) => b.weight - a.weight);

  return (
    <div className="space-y-6">
      {/* Top Banner & Live Calculation */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
        <div>
          <span className="text-slate-400 text-[11px] block">Live Score Derivation</span>
          <span className="text-cyan-300 font-bold text-base">
            {matchedWeight.toFixed(1)} / {totalWeight.toFixed(1)} × 100 = {overallScore}%
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Overall Score</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-heading">{overallScore}%</span>
          </div>
        </div>
      </div>

      {/* Interactive Weight Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 border border-white/10 rounded-2xl font-mono text-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Adjust Requirement Importance Weights
            </h4>
            <span className="text-[10px] text-slate-400">Click status pill to toggle</span>
          </div>

          <div className="space-y-3">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 w-48">
                  <button
                    onClick={() => handleStatusToggle(idx)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      skill.status === 'MATCHED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      skill.status === 'PARTIAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {skill.status}
                  </button>
                  <span className="font-bold text-white text-xs">{skill.name}</span>
                </div>

                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={skill.weight}
                    onChange={(e) => handleWeightChange(idx, e.target.value)}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                  <span className="text-cyan-300 font-bold w-12 text-right">{skill.weight} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Heap Ranking View */}
        <div className="glass-panel p-5 border border-white/10 rounded-2xl font-mono text-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <h4 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                Priority Max-Heap Ranking (O(K log K))
              </h4>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] border border-indigo-500/30">
                Sorted by Weight
              </span>
            </div>

            <div className="space-y-2">
              {rankedSkills.map((s, rank) => (
                <div
                  key={rank}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-400">#{rank + 1}</span>
                    <span className="font-semibold text-slate-200">{s.name}</span>
                    <span className="text-[10px] text-slate-500">({s.category})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold ${
                      s.status === 'MATCHED' ? 'text-emerald-400' : s.status === 'PARTIAL' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {s.status === 'MATCHED' ? `+${s.weight} pts` : s.status === 'PARTIAL' ? `+${s.weight * 0.5} pts` : '0 pts'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 text-[11px] font-bold">
                      {s.weight} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
            <h5 className="font-heading font-bold text-cyan-300 text-xs">Weighted Ranking Explanation</h5>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Not all skills carry equal priority in hiring. The Ranking Algorithm prioritizes requirements with higher weights using a Max-Heap ($O(K \log K)$), ensuring critical core proficiencies have a proportional mathematical influence on candidate evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

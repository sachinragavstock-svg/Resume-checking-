import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info, Calculator, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { recalculateWeights } from '../../utils/api';

export default function ScoreExplanationModal({
  requirements,
  onClose,
  initialOverallScore,
  initialMatchedWeight,
  initialTotalWeight,
  initialFormulaString
}) {
  const [weights, setWeights] = useState(() => {
    const map = {};
    if (requirements) {
      requirements.forEach(r => {
        map[r.name] = r.weight || 10.0;
      });
    }
    return map;
  });

  const [calcScore, setCalcScore] = useState(initialOverallScore);
  const [calcMatchedWeight, setCalcMatchedWeight] = useState(initialMatchedWeight);
  const [calcTotalWeight, setCalcTotalWeight] = useState(initialTotalWeight);
  const [calcFormula, setCalcFormula] = useState(initialFormulaString);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle slider weight changes
  const handleWeightChange = async (skillName, newWeight) => {
    const updatedWeights = { ...weights, [skillName]: parseFloat(newWeight) };
    setWeights(updatedWeights);

    // Dynamic instant math calculation
    let tot = 0;
    let mat = 0;
    requirements.forEach(req => {
      const w = updatedWeights[req.name] !== undefined ? updatedWeights[req.name] : req.weight;
      tot += w;
      if (req.status === 'MATCHED') {
        mat += w * 1.0;
      } else if (req.status === 'PARTIAL') {
        mat += w * 0.5;
      }
    });

    const score = tot > 0 ? Math.round((mat / tot) * 1000) / 10 : 0;
    setCalcMatchedWeight(Math.round(mat * 10) / 10);
    setCalcTotalWeight(Math.round(tot * 10) / 10);
    setCalcScore(score);
    setCalcFormula(`${mat.toFixed(1)} / ${tot.toFixed(1)} × 100 = ${score}%`);
  };

  const handleResetWeights = () => {
    const defaultMap = {};
    requirements.forEach(r => {
      defaultMap[r.name] = 10.0;
    });
    setWeights(defaultMap);
    handleWeightChange('', 0);
  };

  if (!requirements) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal w-full max-w-4xl max-h-[90vh] rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Calculator className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  Explainable AI & DSA Math
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  100% Deterministic
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-100">
                How Was This Score Calculated?
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

        {/* Live Mathematical Formula Banner */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Active Mathematical Derivation
            </span>
            <span className="font-mono text-base font-bold text-cyan-300">
              {calcFormula}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Recalculated Score</span>
              <span className="text-xl font-extrabold text-emerald-400">{calcScore}%</span>
            </div>
          </div>
        </div>

        {/* Requirements Explanation List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-xs font-heading font-semibold text-slate-300 uppercase tracking-wider">
              Itemized Skill Attribution ({requirements.length} Requirements)
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Adjust weight sliders below to test scenario impact
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {requirements.map((req, idx) => {
              const currentWeight = weights[req.name] !== undefined ? weights[req.name] : req.weight;
              const isMatched = req.status === 'MATCHED';
              const isPartial = req.status === 'PARTIAL';
              const isMissing = req.status === 'MISSING';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isMatched
                      ? 'bg-slate-900/80 border-emerald-500/30'
                      : isPartial
                      ? 'bg-slate-900/80 border-amber-500/30'
                      : 'bg-slate-950/70 border-rose-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    {/* Skill name & Status */}
                    <div className="flex items-center gap-3">
                      {isMatched && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {isPartial && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                      {isMissing && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{req.name}</span>
                          {req.normalized_as && req.normalized_as.toLowerCase() !== req.name.toLowerCase() && (
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                              Normalized as: {req.normalized_as}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{req.category || 'General'}</span>
                      </div>
                    </div>

                    {/* Status Pill & Points */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isMatched
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isPartial
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {req.status}
                      </span>
                      <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
                        {isMatched ? currentWeight : isPartial ? currentWeight * 0.5 : 0} / {currentWeight} pts
                      </span>
                    </div>
                  </div>

                  {/* Matching Method and Algorithm Explanations */}
                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] space-y-1 mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 font-semibold shrink-0">Matching Method:</span>
                      <span className={`${isMatched ? 'text-emerald-300' : isPartial ? 'text-amber-300' : 'text-slate-400'}`}>
                        {req.matching_method}
                      </span>
                    </div>
                    {req.algorithm && (
                      <div className="flex items-center gap-2 text-[10px] text-indigo-300">
                        <span className="text-slate-500">Algorithm Engine:</span>
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">
                          {req.algorithm}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Weight Slider */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 shrink-0">Importance Weight:</span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={currentWeight}
                      onChange={(e) => handleWeightChange(req.name, e.target.value)}
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-cyan-300 font-bold w-12 text-right">{currentWeight} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleResetWeights}
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Weights to Default (10 pts)</span>
          </button>

          <button
            onClick={onClose}
            className="btn-primary px-6 py-2 text-xs font-semibold cursor-pointer"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
}

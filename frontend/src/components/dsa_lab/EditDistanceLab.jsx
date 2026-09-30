import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, Grid, CheckCircle2, ArrowDownRight, RefreshCw } from 'lucide-react';
import { fetchEditDistanceLab } from '../../utils/api';

export default function EditDistanceLab() {
  const [word1, setWord1] = useState('PYTHON');
  const [word2, setWord2] = useState('PYTHAN');
  const [edData, setEdData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runEditDistance = async (w1 = word1, w2 = word2) => {
    try {
      const data = await fetchEditDistanceLab(w1, w2);
      setEdData(data);
      setCurrentStepIndex(data.calculation_steps.length - 1); // jump to final by default or animate
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runEditDistance('PYTHON', 'PYTHAN');
  }, []);

  // Cell animation timer
  useEffect(() => {
    let timer;
    if (isPlaying && edData?.calculation_steps && currentStepIndex < edData.calculation_steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 120);
    } else if (isPlaying && edData?.calculation_steps && currentStepIndex >= edData.calculation_steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, edData]);

  const currentStep = edData?.calculation_steps[currentStepIndex];

  // Helper to check if a cell is in the optimal backtrace path
  const isCellInPath = (r, c) => {
    return edData?.backtrace_path?.some(p => p.row === r && p.col === c);
  };

  return (
    <div className="space-y-6">
      {/* Controls & Inputs */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Word 1:</span>
            <input
              type="text"
              value={word1}
              onChange={(e) => setWord1(e.target.value.toUpperCase())}
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 w-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Word 2:</span>
            <input
              type="text"
              value={word2}
              onChange={(e) => setWord2(e.target.value.toUpperCase())}
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-300 font-bold focus:outline-none focus:border-emerald-500 w-32"
            />
          </div>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              runEditDistance(word1, word2);
              setIsPlaying(true);
            }}
            className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Compute DP Matrix</span>
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Animate Cells</span>
          </button>

          <button
            onClick={() => {
              if (edData) setCurrentStepIndex(edData.calculation_steps.length - 1);
            }}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          >
            <span>Jump to End</span>
          </button>
        </div>
      </div>

      {/* Result Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="glass-panel p-4 border border-white/10 rounded-2xl">
          <span className="text-slate-400 text-[11px] block">Levenshtein Edit Distance</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-cyan-300 font-heading">
              {edData?.edit_distance ?? 0}
            </span>
            <span className="text-[10px] text-slate-400">Edits (Insert/Delete/Sub)</span>
          </div>
        </div>

        <div className="glass-panel p-4 border border-white/10 rounded-2xl">
          <span className="text-slate-400 text-[11px] block">String Similarity Metric</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-heading">
              {edData?.similarity_percentage ?? 100}%
            </span>
            <span className="text-[10px] text-slate-400">Fuzzy Match Score</span>
          </div>
        </div>

        <div className="glass-panel p-4 border border-white/10 rounded-2xl">
          <span className="text-slate-400 text-[11px] block">Matrix Dimension</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-indigo-300 font-heading">
              {word1.length + 1} × {word2.length + 1}
            </span>
            <span className="text-[10px] text-slate-400">DP Table Grid</span>
          </div>
        </div>
      </div>

      {/* Dynamic Programming Matrix Grid */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl font-mono">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
            <Grid className="w-4 h-4 text-cyan-400" />
            Dynamic Programming Matrix DP[i][j]
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            Cell: <strong className="text-cyan-300">{currentStepIndex + 1}</strong> / {edData?.calculation_steps?.length || 0}
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="border-collapse font-mono text-xs mx-auto">
            <thead>
              <tr>
                <th className="p-2 border border-slate-800 bg-slate-900 text-slate-500">i \ j</th>
                {edData?.col_headers?.map((col, cIdx) => (
                  <th
                    key={cIdx}
                    className={`p-2.5 border border-slate-800 min-w-[42px] text-center font-bold ${
                      currentStep?.col === cIdx ? 'bg-indigo-950 text-cyan-300 ring-1 ring-cyan-400' : 'bg-slate-900 text-emerald-300'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {edData?.matrix?.map((rowArr, rIdx) => (
                <tr key={rIdx}>
                  <td
                    className={`p-2.5 border border-slate-800 font-bold text-center ${
                      currentStep?.row === rIdx ? 'bg-indigo-950 text-cyan-300 ring-1 ring-cyan-400' : 'bg-slate-900 text-cyan-300'
                    }`}
                  >
                    {edData.row_headers[rIdx]}
                  </td>
                  {rowArr.map((cellVal, cIdx) => {
                    const isCurrentCell = currentStep?.row === rIdx && currentStep?.col === cIdx;
                    const inBacktrace = isCellInPath(rIdx, cIdx);

                    return (
                      <td
                        key={cIdx}
                        className={`p-2.5 border border-slate-800 text-center font-bold transition-all duration-200 ${
                          isCurrentCell
                            ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg ring-2 ring-cyan-300 z-10'
                            : inBacktrace
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/60 shadow-sm'
                            : 'bg-slate-950/60 text-slate-300'
                        }`}
                      >
                        {cellVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Current Cell Recurrence Formula */}
        {currentStep && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Recurrence Formula:</span>
              <span className="text-cyan-300 font-bold">{currentStep.formula || currentStep.message}</span>
            </div>
            {currentStep.op_type && (
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                currentStep.op_type === 'MATCH' ? 'bg-emerald-500/20 text-emerald-300' :
                currentStep.op_type === 'SUBSTITUTE' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                OP: {currentStep.op_type}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Alignment Operations and Complexity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backtrace Alignment */}
        <div className="glass-panel p-5 border border-white/10 rounded-2xl font-mono text-xs">
          <h4 className="font-heading font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            Optimal Alignment Backtrace Path
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {edData?.alignment_operations?.map((op, idx) => (
              <div
                key={idx}
                className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <span className="font-bold text-slate-200">{op.desc}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  op.cost === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  Cost: +{op.cost}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Complexity & Explanation */}
        <div className="glass-panel p-5 border border-white/10 rounded-2xl text-xs space-y-3">
          <h4 className="font-heading font-bold text-sm text-slate-200">
            Edit Distance Complexity
          </h4>
          <div className="space-y-1.5 font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Time Complexity:</span>
              <span className="text-emerald-400 font-bold">O(N × M) = O({word1.length} × {word2.length})</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Space Complexity:</span>
              <span className="text-indigo-300 font-bold">O(N × M) DP Matrix</span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Levenshtein Edit Distance calculates the minimum number of character insertions, deletions, and substitutions needed to transform one skill into another, powering typo tolerance and fuzzy alias matching in ResumeIQ!
          </p>
        </div>
      </div>
    </div>
  );
}

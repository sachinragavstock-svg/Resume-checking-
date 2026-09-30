import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, Search, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';
import { fetchKmpLab } from '../../utils/api';

export default function KmpLab() {
  const [text, setText] = useState('I LOVE PYTHON AND PYTHON');
  const [pattern, setPattern] = useState('PYTHON');
  const [kmpData, setKmpData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runKmp = async (t = text, p = pattern) => {
    try {
      const data = await fetchKmpLab(t, p);
      setKmpData(data);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runKmp('I LOVE PYTHON AND PYTHON', 'PYTHON');
  }, []);

  // Step-by-step playback
  useEffect(() => {
    let timer;
    if (isPlaying && kmpData?.search_steps && currentStepIndex < kmpData.search_steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 500);
    } else if (isPlaying && kmpData?.search_steps && currentStepIndex >= kmpData.search_steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, kmpData]);

  const currentStep = kmpData?.search_steps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Controls & Inputs */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Text:</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-100 font-bold focus:outline-none focus:border-cyan-500 w-56"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Pattern:</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 w-28"
            />
          </div>

          <button
            onClick={() => runKmp(text, pattern)}
            className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start KMP Search</span>
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            onClick={() => {
              if (kmpData && currentStepIndex < kmpData.search_steps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
              }
            }}
            disabled={!kmpData || currentStepIndex >= (kmpData?.search_steps?.length - 1)}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer disabled:opacity-40"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step Next</span>
          </button>
        </div>
      </div>

      {/* LPS (Longest Prefix Suffix) Array Visual Table */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Computed LPS Array (Longest Proper Prefix which is also Suffix)
          </h4>
          <span className="font-mono text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
            Preprocessing Complexity: O(M) = O({pattern.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="font-mono text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 text-[11px]">
                <th className="p-2 border border-slate-800">Index (j)</th>
                {pattern.split('').map((_, idx) => (
                  <th key={idx} className="p-2 border border-slate-800 w-12">{idx}</th>
                ))}
              </tr>
              <tr className="bg-slate-950 text-cyan-300 font-bold">
                <td className="p-2 border border-slate-800 text-slate-400 font-normal">Pattern[j]</td>
                {pattern.split('').map((char, idx) => (
                  <td key={idx} className="p-2 border border-slate-800">{char}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-indigo-950/40 text-emerald-300 font-bold">
                <td className="p-2 border border-slate-800 text-slate-400 font-normal">LPS[j]</td>
                {kmpData?.lps?.map((val, idx) => (
                  <td key={idx} className="p-2 border border-slate-800 text-sm">{val}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Animated Character Comparison Visualizer */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl font-mono">
        <h4 className="font-heading font-bold text-sm text-slate-200 mb-4 flex items-center justify-between">
          <span>Character Comparison Stream</span>
          <span className="text-xs text-slate-400 font-mono">
            Comparisons: <strong className="text-cyan-300">{currentStepIndex + 1}</strong> / {kmpData?.total_comparisons || 0}
          </span>
        </h4>

        {/* Text Ribbon */}
        <div className="mb-4">
          <span className="text-[11px] text-slate-400 block mb-1">Target Text (i pointer):</span>
          <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
            {text.split('').map((char, idx) => {
              const isCurrentI = currentStep?.text_index === idx;
              const isMatchedIndex = kmpData?.matches?.some(m => idx >= m && idx < m + pattern.length);

              return (
                <div
                  key={idx}
                  className={`w-7 h-9 rounded flex flex-col items-center justify-center font-bold text-xs transition-all ${
                    isCurrentI
                      ? currentStep?.is_match
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 scale-110'
                        : 'bg-rose-500 text-white ring-2 ring-rose-300 scale-110'
                      : isMatchedIndex
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{char === ' ' ? '␣' : char}</span>
                  <span className="text-[8px] text-slate-400 opacity-60">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pattern Ribbon */}
        <div className="mb-4">
          <span className="text-[11px] text-slate-400 block mb-1">Pattern (j pointer with LPS skips):</span>
          <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-slate-950 border border-slate-800">
            {pattern.split('').map((char, idx) => {
              const isCurrentJ = currentStep?.pattern_index === idx;

              return (
                <div
                  key={idx}
                  className={`w-7 h-9 rounded flex flex-col items-center justify-center font-bold text-xs transition-all ${
                    isCurrentJ
                      ? currentStep?.is_match
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 scale-110'
                        : 'bg-rose-500 text-white ring-2 ring-rose-300 scale-110'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{char}</span>
                  <span className="text-[8px] text-slate-400 opacity-60">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operation Banner */}
        {currentStep && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-200">{currentStep.message}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentStep.action === 'FULL_PATTERN_MATCH'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : currentStep.action === 'CHAR_MATCH'
                ? 'bg-cyan-500/20 text-cyan-300'
                : currentStep.action === 'LPS_JUMP'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-rose-500/20 text-rose-300'
            }`}>
              {currentStep.action}
            </span>
          </div>
        )}
      </div>

      {/* Complexity & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 border border-white/10 rounded-2xl font-mono text-xs space-y-2">
          <h4 className="font-heading font-bold text-sm text-slate-200 mb-2">
            KMP Computational Complexity
          </h4>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Total Time Complexity:</span>
            <span className="text-emerald-400 font-bold">O(N + M) = O({text.length} + {pattern.length})</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Space Complexity (LPS Table):</span>
            <span className="text-indigo-300 font-bold">O(M)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Matches Found:</span>
            <span className="text-cyan-300 font-bold">{kmpData?.matches?.length || 0} occurrences</span>
          </div>
        </div>

        <div className="glass-panel p-5 border border-white/10 rounded-2xl text-xs space-y-2">
          <h4 className="font-heading font-bold text-sm text-cyan-300">
            Beginner Explanation
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Standard brute-force string search backtracks to the next character on a mismatch, taking $O(N \times M)$ time. KMP precomputes the <strong>LPS table</strong> so it knows the longest prefix that matches a suffix, skipping unnecessary comparisons without ever moving backward in the target text!
          </p>
        </div>
      </div>
    </div>
  );
}

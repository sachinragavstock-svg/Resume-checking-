import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, Hash, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { fetchRabinKarpLab } from '../../utils/api';

export default function RabinKarpLab() {
  const [text, setText] = useState('EXPERIENCED IN PYTHON AND JAVA MICROSERVICES');
  const [pattern, setPattern] = useState('PYTHON');
  const [rkData, setRkData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runRabinKarp = async (t = text, p = pattern) => {
    try {
      const data = await fetchRabinKarpLab(t, p);
      setRkData(data);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runRabinKarp('EXPERIENCED IN PYTHON AND JAVA MICROSERVICES', 'PYTHON');
  }, []);

  // Sliding window animation timer
  useEffect(() => {
    let timer;
    if (isPlaying && rkData?.steps && currentStepIndex < rkData.steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 550);
    } else if (isPlaying && rkData?.steps && currentStepIndex >= rkData.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, rkData]);

  const currentStep = rkData?.steps[currentStepIndex];

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
              onChange={(e) => setText(e.target.value.toUpperCase())}
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-100 font-bold focus:outline-none focus:border-purple-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Pattern:</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value.toUpperCase())}
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-purple-300 font-bold focus:outline-none focus:border-purple-500 w-28"
            />
          </div>

          <button
            onClick={() => runRabinKarp(text, pattern)}
            className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Rabin-Karp</span>
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
              if (rkData && currentStepIndex < rkData.steps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
              }
            }}
            disabled={!rkData || currentStepIndex >= (rkData?.steps?.length - 1)}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer disabled:opacity-40"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>
        </div>
      </div>

      {/* Rolling Hash & Pattern Hash Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="glass-panel p-4 border border-white/10 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-[11px] block">Pattern Hash (Fixed)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-purple-300 font-heading">
              {rkData?.pattern_hash || 0}
            </span>
            <span className="text-[10px] text-slate-400">mod {rkData?.prime_mod || 101}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">Pattern: "{pattern}"</span>
        </div>

        <div className="glass-panel p-4 border border-white/10 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-[11px] block">Current Window Rolling Hash</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-cyan-300 font-heading">
              {currentStep?.window_hash ?? '...'}
            </span>
            <span className="text-[10px] text-slate-400">O(1) Rolling Update</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">Window: "{currentStep?.window_text || '...'}"</span>
        </div>

        <div className="glass-panel p-4 border border-white/10 rounded-2xl flex flex-col justify-between">
          <span className="text-slate-400 text-[11px] block">Hash Collision Tracker</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-400 font-heading">
              {rkData?.collisions_count || 0}
            </span>
            <span className="text-[10px] text-slate-400">Collisions Detected</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">Guaranteed character verification</span>
        </div>
      </div>

      {/* Sliding Window Visualization */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl font-mono">
        <h4 className="font-heading font-bold text-sm text-slate-200 mb-4 flex items-center justify-between">
          <span>Sliding Window Visualization</span>
          <span className="text-xs text-slate-400">
            Window Index: <strong className="text-purple-300">{currentStep?.window_index ?? 0}</strong> / {(text.length - pattern.length)}
          </span>
        </h4>

        {/* Text ribbon with moving window highlight */}
        <div className="flex flex-wrap gap-1 p-3 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto min-h-[60px]">
          {text.split('').map((char, idx) => {
            const winIdx = currentStep?.window_index ?? -1;
            const inWindow = idx >= winIdx && idx < (winIdx + pattern.length);
            const isMatchConfirmed = currentStep?.exact_matched && inWindow;
            const isCollision = currentStep?.is_collision && inWindow;

            return (
              <div
                key={idx}
                className={`w-7 h-9 rounded flex flex-col items-center justify-center font-bold text-xs transition-all ${
                  isMatchConfirmed
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 scale-110'
                    : isCollision
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-110'
                    : inWindow
                    ? 'bg-purple-950 text-purple-200 border-2 border-purple-400 shadow-md shadow-purple-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <span>{char === ' ' ? '␣' : char}</span>
                <span className="text-[8px] text-slate-500">{idx}</span>
              </div>
            );
          })}
        </div>

        {/* Current Step Status Message */}
        {currentStep && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {currentStep.exact_matched && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {currentStep.is_collision && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {!currentStep.hash_matched && <XCircle className="w-4 h-4 text-slate-500" />}
              <span className="text-slate-200">{currentStep.message}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentStep.action === 'MATCH_FOUND' ? 'bg-emerald-500/20 text-emerald-300' :
              currentStep.action === 'HASH_COLLISION' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
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
            Rabin-Karp Complexity Specs
          </h4>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Expected Time Complexity:</span>
            <span className="text-emerald-400 font-bold">O(N + M)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Worst Case (All Collisions):</span>
            <span className="text-amber-400 font-bold">O(N × M)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
            <span className="text-slate-400">Auxiliary Space:</span>
            <span className="text-indigo-300 font-bold">O(1)</span>
          </div>
        </div>

        <div className="glass-panel p-5 border border-white/10 rounded-2xl text-xs space-y-2">
          <h4 className="font-heading font-bold text-sm text-purple-300">
            Beginner Explanation
          </h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Rabin-Karp slides a fixed-length window across the text and computes a <strong>rolling hash</strong> in $O(1)$ time by subtracting the exiting character and adding the entering one. When hashes match, it verifies the exact characters to handle potential hash collisions!
          </p>
        </div>
      </div>
    </div>
  );
}

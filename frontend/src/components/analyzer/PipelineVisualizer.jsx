import React, { useState, useEffect } from 'react';
import {
  FileText,
  Filter,
  Hash,
  GitBranch,
  Search,
  Sliders,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

const STAGE_ICONS = {
  1: FileText,
  2: Filter,
  3: Hash,
  4: GitBranch,
  5: Search,
  6: Sliders,
  7: Award
};

export default function PipelineVisualizer({
  stages,
  activeStageIndex,
  onSelectStage,
  onOpenExplanation,
  overallScore,
  matchedWeight,
  totalWeight,
  formulaString,
  isAnalyzing,
  onReplayAnimation
}) {
  const [revealedScore, setRevealedScore] = useState(0);

  // Animate score counter when stage 7 is reached
  useEffect(() => {
    if (activeStageIndex >= 6 && overallScore > 0) {
      let start = 0;
      const end = overallScore;
      const duration = 1200; // ms
      const stepTime = 20;
      const stepValue = end / (duration / stepTime);

      const timer = setInterval(() => {
        start += stepValue;
        if (start >= end) {
          setRevealedScore(end);
          clearInterval(timer);
        } else {
          setRevealedScore(Math.round(start * 10) / 10);
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setRevealedScore(0);
    }
  }, [activeStageIndex, overallScore]);

  if (!stages || stages.length === 0) return null;

  return (
    <div className="glass-panel p-6 border border-white/10 rounded-2xl relative overflow-hidden my-6">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-indigo-500/40 text-cyan-300">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base sm:text-lg text-slate-100">
                Live Match Engine Pipeline
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                7 Deterministic Stages
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Click any stage card below to inspect its internal algorithmic state and execution logs.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onReplayAnimation}
            className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Pipeline</span>
          </button>

          <button
            onClick={onOpenExplanation}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Info className="w-3.5 h-3.5" />
            <span>How Was This Score Calculated?</span>
          </button>
        </div>
      </div>

      {/* Animated Pipeline Stage Flow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
        {stages.map((stage, idx) => {
          const Icon = STAGE_ICONS[stage.stage_id] || Sparkles;
          const isPassed = activeStageIndex >= idx;
          const isCurrent = activeStageIndex === idx;

          return (
            <div
              key={stage.stage_id}
              onClick={() => onSelectStage(stage)}
              className={`group relative p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[145px] ${
                isCurrent
                  ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400 -translate-y-1'
                  : isPassed
                  ? 'bg-slate-900/80 border-indigo-500/40 hover:border-cyan-400/80 hover:bg-slate-800/90'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-60'
              }`}
            >
              {/* Top Row: Stage number + Status badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  STAGE {stage.stage_id}
                </span>
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                )}
              </div>

              {/* Icon & Name */}
              <div className="my-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : isPassed
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-heading font-bold text-slate-100 leading-tight">
                  {stage.stage_name}
                </h4>
              </div>

              {/* Bottom detail / CTA */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className={`${isPassed ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {isPassed ? 'Click to inspect' : 'Pending'}
                </span>
                <ChevronRight className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
                  isPassed ? 'text-cyan-400' : 'text-slate-600'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Algorithmic Calculation Strip (Section 13 visual proof) */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Step math visual breakdown */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">Matched Weight:</span>
            <span className="font-bold text-emerald-400 text-sm">{matchedWeight}</span>
          </div>

          <span className="text-slate-500 text-lg">/</span>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">Total Weight:</span>
            <span className="font-bold text-cyan-400 text-sm">{totalWeight}</span>
          </div>

          <span className="text-slate-500 text-lg">×</span>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">Factor:</span>
            <span className="font-bold text-indigo-300 text-sm">100</span>
          </div>

          <span className="text-slate-500 text-lg">=</span>

          <div className="flex items-center gap-2 bg-indigo-950/80 px-3.5 py-2 rounded-lg border border-indigo-500/40">
            <span className="text-indigo-300 font-semibold">Score:</span>
            <span className="font-extrabold text-cyan-300 text-base">{formulaString || `${overallScore}%`}</span>
          </div>
        </div>

        {/* Final Big Animated Result Pill */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Match Engine Verdict
            </span>
            <span className={`text-xs font-bold ${
              overallScore >= 75 ? 'text-emerald-400' : overallScore >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {overallScore >= 75 ? 'STRONG CANDIDATE' : overallScore >= 50 ? 'MODERATE FIT' : 'NEEDS SKILL ALIGNMENT'}
            </span>
          </div>

          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-[2px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
              <span className="font-heading font-extrabold text-lg leading-none bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                {revealedScore}%
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-semibold uppercase">
                MATCH
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

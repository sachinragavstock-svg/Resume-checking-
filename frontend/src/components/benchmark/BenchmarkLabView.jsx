import React, { useState, useEffect } from 'react';
import { BarChart3, Zap, Play, RefreshCw, Cpu, AlertCircle, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';
import { fetchBenchmark } from '../../utils/api';

const DATASET_SIZES = [100, 1000, 10000, 50000];

export default function BenchmarkLabView() {
  const [datasetSize, setDatasetSize] = useState(1000);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const runLiveBenchmark = async (size = datasetSize) => {
    setIsRunning(true);
    setErrorMsg('');
    try {
      const data = await fetchBenchmark(size);
      setBenchmarkData(data);
    } catch (e) {
      setErrorMsg(e.message || 'Benchmark execution failed.');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runLiveBenchmark(1000);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Benchmark Header & Controls */}
      <div className="glass-panel p-6 border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 border border-indigo-500/40 text-cyan-300">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-slate-100">
                  Algorithm Performance Lab
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  time.perf_counter()
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live CPU execution time benchmarks measuring empirical latency across dataset sizes from 100 to 50,000 items.
              </p>
            </div>
          </div>

          {/* Dataset Size Picker & Run CTA */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs w-full md:w-auto">
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 px-2 text-[11px]">Dataset:</span>
              {DATASET_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setDatasetSize(size);
                    runLiveBenchmark(size);
                  }}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    datasetSize === size
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {size.toLocaleString()}
                </button>
              ))}
            </div>

            <button
              onClick={() => runLiveBenchmark(datasetSize)}
              disabled={isRunning}
              className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Benchmarking...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Benchmark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Required Hardware Disclaimer Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2.5 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            {benchmarkData?.disclaimer || "Benchmark results depend on the user's hardware, Python version, dataset, and implementation."}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          ⚠️ {errorMsg}
        </div>
      )}

      {benchmarkData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEARCH BENCHMARKS: Linear vs HashMap vs Trie */}
          <div className="glass-panel p-6 border border-white/10 rounded-2xl flex flex-col justify-between font-mono">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-100">
                    Search Algorithm Benchmark
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Linear Search vs HashMap vs Trie ({datasetSize.toLocaleString()} keys)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  Target: "{benchmarkData.search_target}"
                </span>
              </div>

              {/* Bar Comparison Chart */}
              <div className="space-y-4 my-4">
                {benchmarkData.search_benchmarks?.map((bm, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{bm.algorithm}</span>
                        <span className="text-[10px] text-slate-400">({bm.complexity})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300">{bm.time_us} μs</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{bm.speedup}</span>
                      </div>
                    </div>

                    {/* Progress visual bar */}
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(3, bm.bar_percentage)}%`,
                          backgroundColor: bm.color
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">{bm.operations_estimate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Table */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <table className="w-full text-left text-[11px]">
                <thead className="text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="pb-1.5">Method</th>
                    <th className="pb-1.5 text-right">Latency (μs)</th>
                    <th className="pb-1.5 text-right">Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {benchmarkData.search_benchmarks?.map((bm, i) => (
                    <tr key={i}>
                      <td className="py-1.5 font-semibold text-white">{bm.algorithm}</td>
                      <td className="py-1.5 text-right text-cyan-300 font-bold">{bm.time_us} μs</td>
                      <td className="py-1.5 text-right text-slate-400">{bm.complexity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STRING MATCHING BENCHMARKS: Naive vs KMP vs Rabin-Karp */}
          <div className="glass-panel p-6 border border-white/10 rounded-2xl flex flex-col justify-between font-mono">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-100">
                    String Matching Benchmark
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Naive vs KMP vs Rabin-Karp ({benchmarkData.corpus_length_chars?.toLocaleString()} chars corpus)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  Pattern: "{benchmarkData.pattern_searched}"
                </span>
              </div>

              {/* Bar Comparison Chart */}
              <div className="space-y-4 my-4">
                {benchmarkData.string_benchmarks?.map((bm, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{bm.algorithm}</span>
                        <span className="text-[10px] text-slate-400">({bm.complexity})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-300">{bm.time_us} μs</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{bm.speedup}</span>
                      </div>
                    </div>

                    {/* Progress visual bar */}
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(3, bm.bar_percentage)}%`,
                          backgroundColor: bm.color
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">Matches Found: {bm.matches_found}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Table */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <table className="w-full text-left text-[11px]">
                <thead className="text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="pb-1.5">Algorithm</th>
                    <th className="pb-1.5 text-right">Latency (μs)</th>
                    <th className="pb-1.5 text-right">Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {benchmarkData.string_benchmarks?.map((bm, i) => (
                    <tr key={i}>
                      <td className="py-1.5 font-semibold text-white">{bm.algorithm}</td>
                      <td className="py-1.5 text-right text-purple-300 font-bold">{bm.time_us} μs</td>
                      <td className="py-1.5 text-right text-slate-400">{bm.complexity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

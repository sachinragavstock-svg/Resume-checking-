import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, Hash, CheckCircle, AlertCircle, ArrowDown } from 'lucide-react';
import { fetchHashMapLab } from '../../utils/api';

export default function HashMapLab() {
  const [searchKey, setSearchKey] = useState('Python');
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [items, setItems] = useState([
    { key: 'Python', value: 4 },
    { key: 'Java', value: 3 },
    { key: 'React', value: 2 },
    { key: 'SQL', value: 2 },
    { key: 'Git', value: 3 },
    { key: 'AWS', value: 1 },
    { key: 'Docker', value: 1 }
  ]);

  const [labData, setLabData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBucket, setActiveBucket] = useState(null);

  const runSearch = async (keyToSearch = searchKey) => {
    try {
      const data = await fetchHashMapLab(keyToSearch, items);
      setLabData(data);
      setCurrentStepIndex(0);
      setActiveBucket(data.trace.bucket_index);
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    runSearch('Python');
  }, []);

  // Step-by-step playback timer
  useEffect(() => {
    let timer;
    if (isPlaying && labData && currentStepIndex < labData.trace.steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 700);
    } else if (isPlaying && labData && currentStepIndex >= labData.trace.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, labData]);

  const handleAddItem = () => {
    if (!newKey.trim() || !newVal) return;
    const updated = [...items.filter(i => i.key.toLowerCase() !== newKey.trim().toLowerCase()), { key: newKey.trim(), value: parseInt(newVal) || 1 }];
    setItems(updated);
    setNewKey('');
    setNewVal('');
  };

  const currentStep = labData?.trace?.steps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Control Bar & Inputs */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Search Key:</span>
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="e.g. Python"
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 w-32"
            />
          </div>

          <button
            onClick={() => runSearch()}
            className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Search Key</span>
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Trace</span>
          </button>

          <button
            onClick={() => {
              if (labData && currentStepIndex < labData.trace.steps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
              }
            }}
            disabled={!labData || currentStepIndex >= (labData?.trace?.steps?.length - 1)}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer disabled:opacity-40"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step Next</span>
          </button>
        </div>

        {/* Quick Insert Item */}
        <div className="flex items-center gap-2 font-mono text-xs w-full lg:w-auto">
          <input
            type="text"
            placeholder="Key (e.g. Docker)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded text-slate-200 text-xs w-28 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Freq"
            value={newVal}
            onChange={(e) => setNewVal(e.target.value)}
            className="bg-slate-950 border border-slate-800 px-2 py-1.5 rounded text-slate-200 text-xs w-16 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAddItem}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold cursor-pointer"
          >
            + Put
          </button>
        </div>
      </div>

      {/* Lookup Animation Pipeline: INPUT -> HASH -> BUCKET -> VALUE */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl">
        <h4 className="font-heading font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4 text-cyan-400" />
          Lookup Lifecycle Animation: INPUT → HASH → BUCKET → VALUE
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
          {/* Step 1: Input */}
          <div className={`p-3 rounded-xl border text-center transition-all ${
            currentStep?.stage === 'INPUT' ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-1">1. INPUT KEY</span>
            <span className="font-bold text-sm text-white">{searchKey}</span>
          </div>

          {/* Step 2: Hash */}
          <div className={`p-3 rounded-xl border text-center transition-all ${
            currentStep?.stage === 'HASH_COMPUTATION' ? 'bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-400' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-1">2. POLYNOMIAL HASH</span>
            <span className="font-bold text-xs text-cyan-300">
              {labData?.trace?.raw_hash || '...'}
            </span>
          </div>

          {/* Step 3: Bucket */}
          <div className={`p-3 rounded-xl border text-center transition-all ${
            currentStep?.stage === 'BUCKET_MAPPING' || currentStep?.stage === 'CHAIN_TRAVERSAL' ? 'bg-purple-950/80 border-purple-400 ring-2 ring-purple-400' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-1">3. BUCKET INDEX</span>
            <span className="font-bold text-sm text-purple-300">
              Bucket [{labData?.trace?.bucket_index ?? '...'}]
            </span>
          </div>

          {/* Step 4: Value */}
          <div className={`p-3 rounded-xl border text-center transition-all ${
            currentStep?.stage === 'RESULT' ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-1">4. RESOLVED VALUE</span>
            <span className="font-bold text-sm text-emerald-400">
              {labData?.trace?.found ? `Freq = ${labData.trace.value}` : (labData ? 'KEY NOT FOUND' : '...')}
            </span>
          </div>
        </div>

        {/* Current Operation Indicator Box */}
        {currentStep && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-bold text-[10px]">
                STEP {currentStepIndex + 1}/{labData?.trace?.steps?.length}
              </span>
              <span className="text-slate-200">{currentStep.message}</span>
            </div>
            <span className="text-slate-400 text-[11px] hidden sm:block">
              {currentStep.stage}
            </span>
          </div>
        )}
      </div>

      {/* Visual Hash Buckets with Chaining & Frequency Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bucket Array View */}
        <div className="lg:col-span-2 glass-panel p-5 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-heading font-bold text-sm text-slate-200">
              Separate Chaining Bucket Array (Capacity: {labData?.capacity || 16})
            </h4>
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 font-mono text-[10px] rounded border border-cyan-500/30">
              Collision Chaining
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs max-h-80 overflow-y-auto pr-1">
            {labData?.bucket_structure?.map((bucket) => {
              const isTargetBucket = activeBucket === bucket.bucket_index;

              return (
                <div
                  key={bucket.bucket_index}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isTargetBucket
                      ? 'bg-indigo-950/80 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400">
                      [{bucket.bucket_index}]
                    </span>
                    <span className="text-[9px] text-slate-500">
                      len: {bucket.chain_length}
                    </span>
                  </div>

                  {bucket.nodes.length > 0 ? (
                    <div className="space-y-1">
                      {bucket.nodes.map((n, ni) => (
                        <div
                          key={ni}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold truncate ${
                            n.key.toLowerCase() === searchKey.toLowerCase()
                              ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                              : 'bg-slate-900 text-slate-300'
                          }`}
                        >
                          {n.key}: <strong className="text-cyan-300">{n.value}</strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600 italic block py-1">empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Algorithm Complexity & Explanation */}
        <div className="glass-panel p-5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-200 mb-3">
              HashMap Complexity & Specs
            </h4>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Average Lookup:</span>
                <span className="text-emerald-400 font-bold">O(1)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Worst Case (Collisions):</span>
                <span className="text-amber-400 font-bold">O(N)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Space Complexity:</span>
                <span className="text-indigo-300 font-bold">O(N)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <h5 className="font-heading font-bold text-cyan-300 text-xs">Beginner Explanation</h5>
            <p className="text-[11px] leading-relaxed text-slate-400">
              A HashMap turns any string key (e.g. "Python") into an integer index using a polynomial hash function. It retrieves keyword frequencies in instant <strong>O(1)</strong> time instead of scanning the full resume text line-by-line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

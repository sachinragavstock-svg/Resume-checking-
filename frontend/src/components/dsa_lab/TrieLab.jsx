import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, GitBranch, Search, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { fetchTrieLab } from '../../utils/api';

export default function TrieLab() {
  const [searchWord, setSearchWord] = useState('PYTHON');
  const [insertWord, setInsertWord] = useState('');
  const [autocompletePrefix, setAutocompletePrefix] = useState('PY');
  const [wordsInTrie, setWordsInTrie] = useState([
    'PYTHON', 'PYTORCH', 'PANDAS', 'POSTGRESQL', 'PROMETHEUS', 'JAVA', 'JAVASCRIPT', 'REACT', 'REDIS', 'RUST'
  ]);

  const [trieData, setTrieData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadTrieData = async (targetWord = searchWord, prefix = autocompletePrefix, words = wordsInTrie) => {
    try {
      const data = await fetchTrieLab(targetWord, prefix, prefix, words);
      setTrieData(data);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTrieData('PYTHON', 'PY', wordsInTrie);
  }, []);

  // Animate character step-by-step
  useEffect(() => {
    let timer;
    if (isPlaying && trieData?.search_result && currentStepIndex < trieData.search_result.steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 600);
    } else if (isPlaying && trieData?.search_result && currentStepIndex >= trieData.search_result.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, trieData]);

  const handleInsert = () => {
    if (!insertWord.trim()) return;
    const clean = insertWord.trim().toUpperCase();
    if (!wordsInTrie.includes(clean)) {
      const updated = [...wordsInTrie, clean];
      setWordsInTrie(updated);
      loadTrieData(clean, autocompletePrefix, updated);
      setInsertWord('');
    }
  };

  const currentStep = trieData?.search_result?.steps[currentStepIndex];

  return (
    <div className="space-y-6">
      {/* Controls & Inputs */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Search Word:</span>
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value.toUpperCase())}
              placeholder="e.g. PYTHON"
              className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 w-32"
            />
          </div>

          <button
            onClick={() => loadTrieData(searchWord, autocompletePrefix, wordsInTrie)}
            className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Search Trie</span>
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(true);
            }}
            className="btn-secondary px-3 py-1.5 rounded-lg text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Traversal</span>
          </button>
        </div>

        {/* Word Insertion */}
        <div className="flex items-center gap-2 font-mono text-xs w-full lg:w-auto">
          <input
            type="text"
            placeholder="Insert word (e.g. C++)"
            value={insertWord}
            onChange={(e) => setInsertWord(e.target.value.toUpperCase())}
            className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded text-slate-200 text-xs w-36 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleInsert}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold cursor-pointer"
          >
            + Insert
          </button>
        </div>
      </div>

      {/* Traversal Animation: ROOT -> P -> Y -> T -> H -> O -> N ✓ */}
      <div className="glass-panel p-5 border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            Trie Node Traversal Path for "{searchWord}"
          </h4>
          <span className="font-mono text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
            Search Complexity: O(L) = O({searchWord.length})
          </span>
        </div>

        {/* Animated Node Sequence */}
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[90px]">
          {trieData?.search_result?.path?.map((nodeChar, idx) => {
            const isReached = currentStepIndex >= idx;
            const isCurrentNode = currentStepIndex === idx;

            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <span className={`font-bold transition-all ${isReached ? 'text-cyan-400 scale-110' : 'text-slate-700'}`}>
                    ↓
                  </span>
                )}
                <div
                  className={`px-3.5 py-2 rounded-xl font-mono text-sm font-extrabold transition-all duration-300 flex items-center gap-1.5 ${
                    isCurrentNode
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300 scale-110'
                      : isReached
                      ? 'bg-indigo-950/80 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  <span>{nodeChar}</span>
                  {idx === trieData.search_result.path.length - 1 && isReached && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Step Message */}
        {currentStep && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 flex items-center justify-between">
            <span>{currentStep.message}</span>
            <span className="text-cyan-400 font-bold">{trieData?.search_result?.found ? 'MATCH CONFIRMED ✓' : 'IN PROGRESS'}</span>
          </div>
        )}
      </div>

      {/* Autocomplete & Vocabulary Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prefix Autocomplete */}
        <div className="glass-panel p-5 border border-white/10 rounded-2xl">
          <h4 className="font-heading font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Prefix Autocomplete Suggestions
          </h4>

          <div className="flex items-center gap-2 font-mono text-xs mb-3">
            <span className="text-slate-400">Search Prefix:</span>
            <input
              type="text"
              value={autocompletePrefix}
              onChange={(e) => {
                const p = e.target.value.toUpperCase();
                setAutocompletePrefix(p);
                loadTrieData(searchWord, p, wordsInTrie);
              }}
              placeholder="e.g. PY or RE"
              className="bg-slate-950 border border-slate-800 px-3 py-1 rounded text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 w-28"
            />
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {trieData?.autocomplete_suggestions?.length > 0 ? (
              trieData.autocomplete_suggestions.map((word, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchWord(word);
                    loadTrieData(word, autocompletePrefix, wordsInTrie);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
                >
                  <strong className="text-cyan-400">{autocompletePrefix}</strong>
                  {word.slice(autocompletePrefix.length)}
                </button>
              ))
            ) : (
              <span className="text-slate-500 italic text-xs">No autocomplete matches found for "{autocompletePrefix}"</span>
            )}
          </div>
        </div>

        {/* Trie Complexity & Explanation */}
        <div className="glass-panel p-5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-200 mb-3">
              Trie Algorithm Complexity
            </h4>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Search Time Complexity:</span>
                <span className="text-emerald-400 font-bold">O(L) [L = word length]</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Insert Time Complexity:</span>
                <span className="text-cyan-300 font-bold">O(L)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Space Complexity:</span>
                <span className="text-indigo-300 font-bold">O(Σ × L × N)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <h5 className="font-heading font-bold text-cyan-300 text-xs mb-1">Beginner Explanation</h5>
            <p className="text-[11px] leading-relaxed text-slate-400">
              A Trie is a tree structure where each node represents a single character. Instead of comparing whole strings, it traverses one character at a time in <strong>O(L)</strong> steps, making prefix searches and multi-word skill lookups exceptionally fast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

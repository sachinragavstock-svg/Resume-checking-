import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AnalyzerView from './components/analyzer/AnalyzerView';
import DsaLabView from './components/dsa_lab/DsaLabView';
import BenchmarkLabView from './components/benchmark/BenchmarkLabView';
import ArchitectureView from './components/architecture/ArchitectureView';
import { fetchDemoAnalysis } from './utils/api';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load realistic demo on mount as specified in Section 20
  const handleTryDemo = async () => {
    setIsAnalyzing(true);
    setActiveTab('analyzer');
    try {
      const demoRes = await fetchDemoAnalysis();
      setResumeText(demoRes.demo_resume_text || '');
      setJobText(demoRes.demo_job_description || '');
      setAnalysisData(demoRes);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      console.error('Failed to load demo:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    handleTryDemo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTryDemo={handleTryDemo}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6 pb-12">
        {activeTab === 'analyzer' && (
          <AnalyzerView
            resumeText={resumeText}
            setResumeText={setResumeText}
            jobText={jobText}
            setJobText={setJobText}
            analysisData={analysisData}
            setAnalysisData={setAnalysisData}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
          />
        )}

        {activeTab === 'dsa_lab' && <DsaLabView />}

        {activeTab === 'benchmark' && <BenchmarkLabView />}

        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-white/10 bg-[#060910] py-6 px-4 lg:px-8 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Deterministic DSA Match Engine & Laboratory Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>HashMap O(1)</span>
            <span>•</span>
            <span>Trie O(L)</span>
            <span>•</span>
            <span>KMP O(n+m)</span>
            <span>•</span>
            <span>Rabin-Karp O(n+m)</span>
            <span>•</span>
            <span>DP Levenshtein O(nm)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { Upload, FileText, Briefcase, Play, Sparkles, RefreshCw, FileCode } from 'lucide-react';

const JOB_PRESETS = [
  {
    id: 'fullstack',
    title: 'Senior Full-Stack Engineer (Target Sample)',
    content: `Senior Full-Stack & Systems Engineer

We are looking for an exceptional Senior Software Engineer to join our core infrastructure and web platform team.

Requirements:
- Strong proficiency in Python and Java programming languages (Required - 10 pts)
- Proven experience building rich client-side applications with React (Required - 10 pts)
- Hands-on expertise with AWS cloud infrastructure (EC2, S3, RDS) (Required - 10 pts)
- Production experience with Docker containerization and container lifecycles (Required - 10 pts)
- Solid understanding of SQL and relational database modeling (Required - 8 pts)
- Experience with Kubernetes cluster orchestration and deployment (Preferred - 6 pts)
- Background in Machine Learning models, pipelines, and evaluation (Preferred - 6 pts)`
  },
  {
    id: 'backend',
    title: 'Distributed Backend Engineer (Go / Java)',
    content: `Backend Systems Engineer

Responsibilities:
- Build high-throughput microservices and distributed event streams.

Requirements:
- Strong experience in Java, Go, or Python (Required - 10 pts)
- Deep understanding of SQL databases (PostgreSQL/MySQL) and Redis caching (Required - 10 pts)
- Microservices architecture and REST API / gRPC design (Required - 10 pts)
- Hands-on Docker and Kubernetes deployments (Required - 10 pts)
- Solid knowledge of Data Structures and Algorithms (Required - 8 pts)`
  },
  {
    id: 'frontend',
    title: 'Frontend UI/UX Architect (React / TS)',
    content: `Senior Frontend Engineer

Responsibilities:
- Architect high-performance client applications and state machines.

Requirements:
- Mastery of React, JavaScript, and TypeScript (Required - 10 pts)
- Expert in HTML5, CSS3, and Tailwind CSS responsive styling (Required - 10 pts)
- Experience integrating REST API and GraphQL data endpoints (Required - 8 pts)
- Version control proficiency with Git & GitHub (Required - 6 pts)`
  }
];

export default function InputSection({
  resumeText,
  setResumeText,
  jobText,
  setJobText,
  onAnalyze,
  onFileSelect,
  selectedFileName,
  isAnalyzing,
  onLoadPreset
}) {
  const [activeInputTab, setActiveInputTab] = useState('text'); // 'text' or 'file'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Resume Input Box */}
      <div className="glass-panel p-5 flex flex-col border border-white/10 rounded-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-slate-100">Resume Source</h3>
              <p className="text-[11px] text-slate-400">PDF, TXT, or direct text input</p>
            </div>
          </div>

          {/* Toggle between Text and File Upload */}
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveInputTab('text')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                activeInputTab === 'text' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Text Editor
            </button>
            <button
              onClick={() => setActiveInputTab('file')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                activeInputTab === 'file' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upload File
            </button>
          </div>
        </div>

        {activeInputTab === 'text' ? (
          <div className="flex-1 flex flex-col">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste candidate resume text here (e.g. Alex Chen, Skills: Python, Java, React, SQL, Git, ML...)"
              className="w-full flex-1 min-h-[220px] bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono resize-none transition-all"
            />
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-mono">
              <span>{resumeText ? resumeText.trim().split(/\s+/).length : 0} words</span>
              <span>{resumeText.length} characters</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-slate-700/80 hover:border-indigo-500/80 rounded-xl p-6 bg-slate-950/30 transition-all cursor-pointer relative min-h-[220px]">
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onFileSelect(e.target.files[0]);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-1">
              {selectedFileName ? `Selected: ${selectedFileName}` : 'Click or Drag & Drop Resume File'}
            </p>
            <p className="text-[11px] text-slate-400">Supported formats: .PDF, .TXT, .MD</p>
            {selectedFileName && (
              <span className="mt-3 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-mono">
                ✓ Ready for Live Extraction
              </span>
            )}
          </div>
        )}
      </div>

      {/* Job Description Input Box */}
      <div className="glass-panel p-5 flex flex-col border border-white/10 rounded-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-slate-100">Job Description</h3>
              <p className="text-[11px] text-slate-400">Target role requirements & weights</p>
            </div>
          </div>

          {/* Preset Selector */}
          <select
            onChange={(e) => {
              const preset = JOB_PRESETS.find(p => p.id === e.target.value);
              if (preset) {
                setJobText(preset.content);
                if (onLoadPreset) onLoadPreset(preset);
              }
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="">Load Preset Role...</option>
            {JOB_PRESETS.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col">
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste target job description or requirements here..."
            className="w-full flex-1 min-h-[220px] bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono resize-none transition-all"
          />
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-mono">
            <span>{jobText ? jobText.trim().split(/\s+/).length : 0} words</span>
            <span>{jobText.length} characters</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button Bar */}
      <div className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-white/10 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-slate-900 animate-ping" />
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <p className="text-xs text-slate-300">
            Real-time multi-stage pipeline: <strong className="text-cyan-300">HashMap</strong>, <strong className="text-indigo-300">Trie</strong>, <strong className="text-cyan-300">KMP</strong>, <strong className="text-purple-300">Rabin-Karp</strong>, <strong className="text-emerald-300">DP Edit Distance</strong> & <strong className="text-amber-300">Heap Ranking</strong>.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || (!resumeText.trim() && !selectedFileName) || !jobText.trim()}
          className="btn-primary w-full sm:w-auto px-8 py-3 rounded-xl font-heading font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Executing Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Analyze Resume (Live Engine)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

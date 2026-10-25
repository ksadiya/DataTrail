import { useState } from 'react';
import { Header } from './components/Header';
import { PolicyInputBar } from './components/PolicyInputBar';
import { SAMPLE_POLICIES } from './data/samples';
import { Shield, Sparkles, Database, FileCheck } from 'lucide-react';

export default function App() {
  const [currentText, setCurrentText] = useState<string>(SAMPLE_POLICIES[0].text);
  const [currentTitle, setCurrentTitle] = useState<string>(SAMPLE_POLICIES[0].name);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

  const handleAnalyzeText = (text: string, title: string) => {
    setIsAnalyzing(true);
    setCurrentText(text);
    setCurrentTitle(title);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header
        activePolicyTitle={currentTitle}
        wordCount={wordCount}
        onOpenInspector={() => alert("Full policy text viewer will open here.")}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-700/40 text-cyan-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Privacy Investigation Experience</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Follow Your Personal Data Across The Policy Trail
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            DataTrail maps personal data types through four crucial stages: <strong className="text-cyan-400 font-semibold">COLLECT</strong>, <strong className="text-emerald-400 font-semibold">USE</strong>, <strong className="text-amber-400 font-semibold">SHARE</strong>, and <strong className="text-purple-400 font-semibold">KEEP</strong>. Every claim is attributed to verbatim text with honesty labels separating stated claims from vague qualifiers and silent omissions.
          </p>
        </div>

        {/* Input Bar */}
        <PolicyInputBar
          onAnalyzeText={handleAnalyzeText}
          isAnalyzing={isAnalyzing}
          currentTitle={currentTitle}
        />

        {/* Active Policy Summary Card */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
                Loaded Document
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{currentTitle}</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                {wordCount.toLocaleString()} words
              </span>
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Source Verified
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-3 font-mono bg-[#090D16] p-3.5 rounded-xl border border-slate-800/60 leading-relaxed">
            {currentText.slice(0, 450)}...
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-[#090D16] py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>DataTrail • Built for Devpost Build With AI: Basics • Evaluates claims, not runtime behavior</span>
        </p>
      </footer>
    </div>
  );
}

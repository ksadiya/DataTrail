import { useState } from 'react';
import { Header } from './components/Header';
import { PolicyInputBar } from './components/PolicyInputBar';
import { DataTypeSelector } from './components/DataTypeSelector';
import { usePolicyAnalysis } from './hooks/usePolicyAnalysis';
import { Shield, Sparkles, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export default function App() {
  const {
    text,
    title,
    analysisResult,
    selectedTypeId,
    setSelectedTypeId,
    activeTrail,
    isAnalyzing,
    setPolicy
  } = usePolicyAnalysis();

  const [_activeInspectorQuote, setActiveInspectorQuote] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header
        activePolicyTitle={title}
        wordCount={analysisResult.wordCount}
        onOpenInspector={() => setActiveInspectorQuote(text.slice(0, 300))}
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
          onAnalyzeText={setPolicy}
          isAnalyzing={isAnalyzing}
          currentTitle={title}
        />

        {/* Discovered Data Types Selector */}
        <DataTypeSelector
          dataTypes={analysisResult.discoveredDataTypes}
          selectedId={selectedTypeId}
          onSelect={setSelectedTypeId}
        />

        {/* Interim Trail Preview Card (Slice 2) */}
        {activeTrail && (
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-5">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
                  Active Investigation Trail
                </span>
                <h2 className="text-xl font-bold text-slate-100 mt-1 flex items-center gap-2">
                  <span>{activeTrail.label}</span>
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">{activeTrail.description}</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeTrail.metrics.statedStages} Stated</span>
                </span>
                <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{activeTrail.metrics.vagueStages} Vague</span>
                </span>
                <span className="flex items-center gap-1 text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{activeTrail.metrics.missingStages} Not Found</span>
                </span>
              </div>
            </div>

            {/* Quick 4-stage summary grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['collect', 'use', 'share', 'keep'] as const).map(stageKey => {
                const stage = activeTrail.stages[stageKey];
                return (
                  <div key={stageKey} className="p-4 rounded-xl bg-[#090D16] border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                          {stage.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          stage.status === 'stated'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                            : stage.status === 'vague'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {stage.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 mb-1 leading-snug">
                        {stage.headline}
                      </p>
                      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                        {stage.summary}
                      </p>
                    </div>

                    {stage.evidence.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60">
                        <p className="text-[10px] font-mono text-cyan-400 line-clamp-2 italic">
                          "{stage.evidence[0].quote}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

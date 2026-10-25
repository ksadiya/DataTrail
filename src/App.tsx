import { useState } from 'react';
import { Header } from './components/Header';
import { PolicyInputBar } from './components/PolicyInputBar';
import { DataTypeSelector } from './components/DataTypeSelector';
import { TrailBoard } from './components/TrailBoard';
import { usePolicyAnalysis } from './hooks/usePolicyAnalysis';
import { TrailStage } from './types/policy';
import { Shield, Sparkles } from 'lucide-react';

export default function App() {
  const {
    text: _text,
    title,
    analysisResult,
    selectedTypeId,
    setSelectedTypeId,
    activeTrail,
    isAnalyzing,
    setPolicy
  } = usePolicyAnalysis();

  const [selectedStageForEvidence, setSelectedStageForEvidence] = useState<TrailStage | null>(null);

  const handleOpenEvidence = (stage: TrailStage) => {
    setSelectedStageForEvidence(stage);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header
        activePolicyTitle={title}
        wordCount={analysisResult.wordCount}
        onOpenInspector={() => alert("Full policy text inspector will open in the next panel.")}
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

        {/* Interactive 4-Stage Trail Board */}
        {activeTrail && (
          <TrailBoard
            trail={activeTrail}
            onOpenEvidence={handleOpenEvidence}
            activeStageKey={selectedStageForEvidence?.stage}
          />
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

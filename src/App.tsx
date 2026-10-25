import { useState } from 'react';
import { Header } from './components/Header';
import { PolicyInputBar } from './components/PolicyInputBar';
import { DataTypeSelector } from './components/DataTypeSelector';
import { TrailBoard } from './components/TrailBoard';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { NecessityCard } from './components/NecessityCard';
import { RightsPanel } from './components/RightsPanel';
import { PolicyTextInspector } from './components/PolicyTextInspector';
import { usePolicyAnalysis } from './hooks/usePolicyAnalysis';
import { TrailStage } from './types/policy';
import { Shield, Sparkles } from 'lucide-react';

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

  const [selectedStageForEvidence, setSelectedStageForEvidence] = useState<TrailStage | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [inspectorTargetQuote, setInspectorTargetQuote] = useState<string | null>(null);

  const handleOpenEvidence = (stage: TrailStage) => {
    setSelectedStageForEvidence(stage);
  };

  const handleCloseEvidence = () => {
    setSelectedStageForEvidence(null);
  };

  const handleJumpToFullText = (quote: string) => {
    setInspectorTargetQuote(quote);
    setIsInspectorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header
        activePolicyTitle={title}
        wordCount={analysisResult.wordCount}
        onOpenInspector={() => {
          setInspectorTargetQuote(null);
          setIsInspectorOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Hero Section */}
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

        {/* Policy Ingestion Surface */}
        <PolicyInputBar
          onAnalyzeText={setPolicy}
          isAnalyzing={isAnalyzing}
          currentTitle={title}
        />

        {/* Stage 1: Data Type Selection Matrix */}
        <DataTypeSelector
          dataTypes={analysisResult.discoveredDataTypes}
          selectedId={selectedTypeId}
          onSelect={setSelectedTypeId}
        />

        {/* Stage 2: Central 4-Stage Interactive Trail Board */}
        {activeTrail && (
          <TrailBoard
            trail={activeTrail}
            onOpenEvidence={handleOpenEvidence}
            activeStageKey={selectedStageForEvidence?.stage}
          />
        )}

        {/* Stage 3: Analytical Necessity & Uncertainty Card */}
        {activeTrail && (
          <NecessityCard trail={activeTrail} />
        )}

        {/* Stage 4: Grievance Redressal & Data Rights Panel */}
        <RightsPanel
          analysis={analysisResult}
          onJumpToQuote={handleJumpToFullText}
        />
      </main>

      {/* Slide-out Verbatim Evidence Drawer */}
      {activeTrail && (
        <EvidenceDrawer
          stage={selectedStageForEvidence}
          trail={activeTrail}
          onClose={handleCloseEvidence}
          onJumpToFullText={handleJumpToFullText}
        />
      )}

      {/* Full Policy Text Inspector Modal */}
      <PolicyTextInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        rawText={text}
        policyTitle={title}
        targetQuote={inspectorTargetQuote}
      />

      <footer className="border-t border-slate-900 bg-[#090D16] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>DataTrail • Built with AI for Devpost Build With AI: Basics</span>
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            Claims, not runtime behavior • Zero quote hallucinations guarantee
          </p>
        </div>
      </footer>
    </div>
  );
}

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
import { SAMPLE_POLICIES } from './data/samples';
import { TrailStage } from './types/policy';
import { Shield, Sparkles, AlertCircle, RotateCcw, Loader2, Compass } from 'lucide-react';

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

  const handleResetToSample = () => {
    setPolicy(SAMPLE_POLICIES[0].text, SAMPLE_POLICIES[0].name);
  };

  return (
    <div className="min-h-screen bg-[#0B070D] text-cream-100 flex flex-col font-sans selection:bg-teal-500/25 selection:text-teal-200">
      <Header
        activePolicyTitle={title}
        wordCount={analysisResult.wordCount}
        onOpenInspector={() => {
          setInspectorTargetQuote(null);
          setIsInspectorOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Hero Section in Burgundy/Cream/Teal */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-burgundy-950/90 border border-burgundy-700/60 text-burgundy-300 text-xs font-medium mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span className="font-mono">Interactive Privacy Investigation Experience</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-100 tracking-tight mb-2.5 font-sans">
            Follow Your Personal Data Across The Policy Trail
          </h1>
          <p className="text-cream-300/80 text-sm sm:text-base max-w-3xl leading-relaxed font-sans">
            DataTrail maps individual personal data types through four crucial stages: <strong className="text-teal-300 font-semibold">COLLECT</strong>, <strong className="text-emerald-400 font-semibold">USE</strong>, <strong className="text-amber-400 font-semibold">SHARE</strong>, and <strong className="text-burgundy-400 font-semibold">KEEP</strong>. Every claim is attributed to verbatim text with honesty labels separating stated claims from vague qualifiers, silent omissions, and analytical interpretations.
          </p>
        </div>

        {/* Policy Ingestion Surface */}
        <PolicyInputBar
          onAnalyzeText={setPolicy}
          isAnalyzing={isAnalyzing}
          currentTitle={title}
        />

        {/* Loading State Animation */}
        {isAnalyzing ? (
          <div className="bg-[#140C16] border border-[#2E1B33] rounded-3xl p-12 text-center my-8 shadow-xl">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-cream-100 mb-1">
              Analyzing Policy Clauses & Ingestion Claims...
            </h3>
            <p className="text-xs text-cream-400 max-w-md mx-auto font-mono">
              Tokenizing sentences • Discovering personal data categories • Verifying verbatim quote substrings
            </p>
          </div>
        ) : !analysisResult.isValidPolicy ? (
          /* Honest Empty / Invalid Policy State */
          <div className="bg-[#140C16] border border-burgundy-900/60 rounded-3xl p-10 text-center my-8 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-burgundy-950 border border-burgundy-700/60 flex items-center justify-center mx-auto mb-4 text-burgundy-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-cream-100 mb-2 font-sans">
              No Personal Data Trails Discovered
            </h3>
            <p className="text-xs text-cream-300 max-w-lg mx-auto leading-relaxed mb-6 font-sans">
              {analysisResult.emptyReason ||
                'The submitted text does not contain identifiable personal data collection or privacy clauses. DataTrail investigates actual privacy representations.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetToSample}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-teal-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Verified Swiggy Policy</span>
              </button>
              <button
                onClick={() => setPolicy(SAMPLE_POLICIES[1].text, SAMPLE_POLICIES[1].name)}
                className="px-5 py-2.5 rounded-xl bg-[#221326] hover:bg-[#2C1832] text-cream-100 text-xs font-semibold transition border border-[#331C38]"
              >
                <span>Load Zomato Policy</span>
              </button>
              <button
                onClick={() => setPolicy(SAMPLE_POLICIES[2].text, SAMPLE_POLICIES[2].name)}
                className="px-5 py-2.5 rounded-xl bg-[#221326] hover:bg-[#2C1832] text-cream-100 text-xs font-semibold transition border border-[#331C38]"
              >
                <span>Load WhatsApp Policy</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Active Investigation Flow */
          <>
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
          </>
        )}
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

      <footer className="border-t border-[#26152B] bg-[#0E0810] py-6 text-center text-xs text-cream-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" />
            <span className="font-sans">DataTrail • Built with AI for Devpost Build With AI: Basics</span>
          </p>
          <p className="font-mono text-[11px] text-cream-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Claims, not runtime behavior • 100% verified verbatim quotations</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

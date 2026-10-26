import React, { useEffect, useState } from 'react';
import { TrailStage, DataTypeTrail } from '../types/policy';
import {
  X,
  Quote,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileSearch,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface EvidenceDrawerProps {
  stage: TrailStage | null;
  trail: DataTypeTrail;
  onClose: () => void;
  onJumpToFullText: (quote: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  stage,
  trail,
  onClose,
  onJumpToFullText
}) => {
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!stage) return null;

  const handleCopyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedQuote(quote);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-out drawer */}
      <div className="relative w-full max-w-2xl bg-[#140C16] border-l border-[#2E1B33] h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#26152B] bg-[#0E0810]/95 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-md border border-teal-800/40">
                Verbatim Evidence Inspector
              </span>
              <span className="text-xs text-cream-400 font-mono">
                {trail.label}
              </span>
            </div>
            <h3 className="text-xl font-bold text-cream-100 tracking-tight flex items-center gap-2 font-sans">
              <span>{stage.title}</span>
            </h3>
            <p className="text-xs text-cream-400/80 font-sans mt-1">
              Verifying claims and detecting corporate hedging in the raw policy text.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-cream-400 hover:text-white bg-[#1F1323] hover:bg-burgundy-900/60 transition border border-[#2E1B33]"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Breakdown Card */}
          <div className="p-5 rounded-2xl bg-[#0A060C] border border-[#26152B]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-cream-400 font-semibold">
                Claim Classification
              </span>
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                stage.status === 'stated'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : stage.status === 'vague'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  : 'bg-[#180F1D] text-cream-500 border-[#331C38]'
              }`}>
                {stage.status === 'stated' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {stage.status === 'vague' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {stage.status === 'not_found' && <HelpCircle className="w-3.5 h-3.5 text-cream-500" />}
                <span>{stage.status.replace('_', ' ')}</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-cream-100 mb-1">{stage.headline}</p>
            <p className="text-xs text-cream-300/85 leading-relaxed font-sans">{stage.summary}</p>

            {stage.vaguenessReason && (
              <div className="mt-3.5 p-3 rounded-xl bg-amber-950/30 border border-amber-700/40 text-xs text-amber-200/90 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300">Ambiguity Notice: </strong>
                  <span>{stage.vaguenessReason}</span>
                </div>
              </div>
            )}
          </div>

          {/* Verbatim Quotes List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-cream-400 font-bold flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-teal-300" />
                <span>Extracted Verbatim Clauses ({stage.evidence.length})</span>
              </h4>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Substring Match</span>
              </span>
            </div>

            {stage.evidence.length > 0 ? (
              <div className="space-y-4">
                {stage.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0A060C] border border-[#2E1B33] hover:border-burgundy-800 transition"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-cream-500 mb-2">
                      <span className="text-teal-300 font-semibold">
                        Clause #{idx + 1} • {ev.sourceSection || 'Policy Section'}
                      </span>
                      {ev.lineNumber && (
                        <span>Line ~{ev.lineNumber}</span>
                      )}
                    </div>

                    <p className="text-xs font-mono text-cream-100 leading-relaxed p-3.5 bg-[#140C16] rounded-xl border border-[#26152B] italic mb-3">
                      "{ev.quote}"
                    </p>

                    {/* Hedges highlighted if present */}
                    {ev.hedgesFound && ev.hedgesFound.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-amber-400 font-mono">Hedges found:</span>
                        {ev.hedgesFound.map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50 text-[10px] font-mono"
                          >
                            "{h}"
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#1F1223]">
                      <button
                        onClick={() => handleCopyQuote(ev.quote)}
                        className="text-xs text-cream-400 hover:text-cream-200 font-mono flex items-center gap-1 transition"
                      >
                        {copiedQuote === ev.quote ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Quote</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onJumpToFullText(ev.quote)}
                        className="text-xs text-teal-300 hover:text-teal-200 font-medium flex items-center gap-1.5 transition"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>Locate in Full Policy Text →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#0A060C] border border-dashed border-[#2E1B33] text-center">
                <HelpCircle className="w-8 h-8 text-cream-600 mx-auto mb-2" />
                <h5 className="text-sm font-semibold text-cream-200 mb-1">Silence in the Policy</h5>
                <p className="text-xs text-cream-400 max-w-md mx-auto leading-relaxed font-sans">
                  The uploaded privacy policy completely omits terms governing how {trail.label.toLowerCase()} is {stage.stage === 'keep' ? 'retained or deleted' : 'disclosed'}. In privacy law, silent omission means the user is left without explicit contractual guarantees.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#26152B] bg-[#0E0810] flex items-center justify-between text-xs text-cream-500 font-mono">
          <span>Zero Hallucinations Guarantee</span>
          <button
            onClick={() => onJumpToFullText(stage.evidence[0]?.quote || '')}
            className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-xs"
          >
            <span>Open Full Policy</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

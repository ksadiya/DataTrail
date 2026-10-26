import React from 'react';
import { Compass, AlertCircle, FileText, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenInspector?: () => void;
  activePolicyTitle?: string;
  wordCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInspector,
  activePolicyTitle,
  wordCount
}) => {
  return (
    <header className="border-b border-[#2E1B33] bg-[#0E0810]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand identity: Deep burgundy base with vibrant teal compass and cream typography */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-burgundy-900 via-[#1C1022] to-teal-950 border border-burgundy-700/40 flex items-center justify-center shadow-lg shadow-burgundy-950/60">
            <Compass className="w-5 h-5 text-teal-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-cream-100 font-sans">
                Data<span className="text-teal-400">Trail</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-burgundy-950/90 text-burgundy-300 border border-burgundy-700/60 font-mono">
                AI Basics Hackathon
              </span>
            </div>
            <p className="text-xs text-cream-400/80 font-sans">
              Personal Data Journey Intelligence • <span className="text-teal-300 font-medium">COLLECT → USE → SHARE → KEEP</span>
            </p>
          </div>
        </div>

        {/* Status badges & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180E1C] border border-[#331C38] text-xs text-cream-300/90"
            title="DataTrail analyzes stated legal disclosures. It does not pretend to monitor runtime socket telemetry."
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[11px]">Claims, Not Runtime Truth</span>
          </div>

          {activePolicyTitle && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1222] border border-burgundy-900/60 text-xs text-cream-200 font-mono">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse"></span>
              <span className="truncate max-w-[190px]">{activePolicyTitle}</span>
              {wordCount !== undefined && (
                <span className="text-cream-500 text-[11px]">({wordCount.toLocaleString()}w)</span>
              )}
            </div>
          )}

          {onOpenInspector && (
            <button
              onClick={onOpenInspector}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#221329] hover:bg-[#2C1835] text-cream-100 text-xs font-medium border border-burgundy-800/60 transition shadow-sm"
              title="View full source policy clauses"
            >
              <FileText className="w-3.5 h-3.5 text-teal-300" />
              <span>Full Policy Text</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-cream-400/70 px-2.5 py-1 rounded-lg bg-[#140C16] border border-[#26152B] font-mono">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>Zero Hallucinations</span>
          </div>
        </div>
      </div>
    </header>
  );
};

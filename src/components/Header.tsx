import React from 'react';
import { ShieldCheck, Compass, AlertCircle, FileText } from 'lucide-react';

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
    <header className="border-b border-[#1E293B] bg-[#090D16]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-800 to-cyan-950 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-950/40">
            <Compass className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Data<span className="text-cyan-400">Trail</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/40">
                v1.0 POC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Personal Data Journey Intelligence • <span className="text-slate-300">Collect → Use → Share → Keep</span>
            </p>
          </div>
        </div>

        {/* Status badges & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400" title="DataTrail analyzes stated legal disclosures. It does not monitor network packets or phone telemetry.">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Claims, Not Runtime Truth</span>
          </div>

          {activePolicyTitle && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              <span className="truncate max-w-[180px]">{activePolicyTitle}</span>
              {wordCount !== undefined && (
                <span className="text-slate-500">({wordCount.toLocaleString()} words)</span>
              )}
            </div>
          )}

          {onOpenInspector && (
            <button
              onClick={onOpenInspector}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="View full source policy clauses"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Policy Text</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 px-2 py-1 rounded bg-slate-950 border border-slate-900">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Zero Hallucinations Guarantee</span>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { TrailStage } from '../types/policy';
import {
  Inbox,
  Cpu,
  Share2,
  Archive,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search,
  Quote,
  ShieldCheck
} from 'lucide-react';

interface TrailNodeCardProps {
  stage: TrailStage;
  stageNumber: number;
  onOpenEvidence: (stage: TrailStage) => void;
  isActive?: boolean;
}

export const TrailNodeCard: React.FC<TrailNodeCardProps> = ({
  stage,
  stageNumber,
  onOpenEvidence,
  isActive = false
}) => {
  const getStageIcon = () => {
    switch (stage.stage) {
      case 'collect': return <Inbox className="w-5 h-5" />;
      case 'use': return <Cpu className="w-5 h-5" />;
      case 'share': return <Share2 className="w-5 h-5" />;
      case 'keep': return <Archive className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (stage.status) {
      case 'stated':
        return {
          border: 'border-emerald-500/60',
          bg: 'bg-slate-900/90',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          iconColor: 'text-emerald-400',
          glow: 'hover:shadow-emerald-950/50',
          titleColor: 'text-emerald-300'
        };
      case 'vague':
        return {
          border: 'border-amber-500/60',
          bg: 'bg-slate-900/90',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          iconColor: 'text-amber-400',
          glow: 'hover:shadow-amber-950/50',
          titleColor: 'text-amber-300'
        };
      case 'not_found':
        return {
          border: 'border-slate-800',
          bg: 'bg-[#090D16]/90',
          badgeBg: 'bg-slate-900 text-slate-400 border-slate-700',
          iconColor: 'text-slate-500',
          glow: '',
          titleColor: 'text-slate-400'
        };
      default:
        return {
          border: 'border-cyan-500/60',
          bg: 'bg-slate-900/90',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          iconColor: 'text-cyan-400',
          glow: '',
          titleColor: 'text-cyan-300'
        };
    }
  };

  const colors = getStatusColor();
  const primaryEvidence = stage.evidence[0];

  return (
    <div
      className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${colors.glow} relative group ${
        isActive ? 'ring-2 ring-cyan-400' : ''
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl bg-slate-800/80 ${colors.iconColor} border border-slate-700/60 shadow-sm`}>
              {getStageIcon()}
            </span>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block font-semibold">
                STAGE {stageNumber} OF 4
              </span>
              <h4 className="text-sm font-bold text-slate-100 font-sans tracking-tight">
                {stage.title}
              </h4>
            </div>
          </div>

          {/* Honesty Status Badge */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border shadow-sm ${colors.badgeBg}`}
          >
            {stage.status === 'stated' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            {stage.status === 'vague' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
            {stage.status === 'not_found' && <HelpCircle className="w-3 h-3 text-slate-500" />}
            <span>{stage.status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Stage Headline */}
        <h5 className={`text-xs font-semibold mb-1.5 leading-snug ${colors.titleColor}`}>
          {stage.headline}
        </h5>

        {/* Stage Summary Description */}
        <p className="text-xs text-slate-300/90 leading-relaxed mb-3 font-sans">
          {stage.summary}
        </p>

        {/* Vagueness Callout if applicable */}
        {stage.status === 'vague' && stage.vaguenessReason && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200/90 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Ambiguity Detected: </span>
              <span>{stage.vaguenessReason}</span>
            </div>
          </div>
        )}

        {/* Primary Verbatim Quote Preview */}
        {primaryEvidence ? (
          <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 mb-4 group-hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 text-cyan-400">
                <Quote className="w-3 h-3" />
                <span>Verbatim Policy Claim</span>
              </span>
              {primaryEvidence.lineNumber && (
                <span className="text-slate-400">Line ~{primaryEvidence.lineNumber}</span>
              )}
            </div>
            <p className="text-xs font-mono text-slate-200 leading-relaxed italic line-clamp-3">
              "{primaryEvidence.quote}"
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-[#090D16]/50 border border-dashed border-slate-800 mb-4 text-center">
            <p className="text-xs text-slate-400 italic">
              No matching clause found in the submitted text.
            </p>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <span>{stage.evidence.length} clause{stage.evidence.length === 1 ? '' : 's'} verified</span>
        </span>

        <button
          onClick={() => onOpenEvidence(stage)}
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-cyan-950/40"
        >
          <Search className="w-3 h-3" />
          <span>Inspect Evidence →</span>
        </button>
      </div>
    </div>
  );
};

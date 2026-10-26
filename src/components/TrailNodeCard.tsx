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
          border: 'border-emerald-600/60',
          bg: 'bg-[#140C16]',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50',
          iconColor: 'text-emerald-400',
          glow: 'hover:shadow-emerald-950/40',
          titleColor: 'text-emerald-300'
        };
      case 'vague':
        return {
          border: 'border-amber-600/60',
          bg: 'bg-[#140C16]',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-600/50',
          iconColor: 'text-amber-400',
          glow: 'hover:shadow-amber-950/40',
          titleColor: 'text-amber-300'
        };
      case 'not_found':
        return {
          border: 'border-[#2E1B33]',
          bg: 'bg-[#0E0810]',
          badgeBg: 'bg-[#1C1220] text-cream-500 border-[#331C38]',
          iconColor: 'text-cream-600',
          glow: '',
          titleColor: 'text-cream-400'
        };
      default:
        return {
          border: 'border-teal-600/60',
          bg: 'bg-[#140C16]',
          badgeBg: 'bg-teal-950/80 text-teal-300 border-teal-600/50',
          iconColor: 'text-teal-400',
          glow: '',
          titleColor: 'text-teal-300'
        };
    }
  };

  const colors = getStatusColor();
  const primaryEvidence = stage.evidence[0];

  return (
    <div
      className={`rounded-3xl border ${colors.border} ${colors.bg} p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${colors.glow} relative group ${
        isActive ? 'ring-2 ring-teal-400 shadow-xl shadow-teal-950/50' : ''
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl bg-[#1D1121] ${colors.iconColor} border border-[#2E1B33] shadow-sm`}>
              {getStageIcon()}
            </span>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-cream-500 block font-semibold">
                STAGE {stageNumber} OF 4
              </span>
              <h4 className="text-sm font-bold text-cream-100 font-sans tracking-tight">
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
            {stage.status === 'not_found' && <HelpCircle className="w-3 h-3 text-cream-500" />}
            <span>{stage.status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Stage Headline */}
        <h5 className={`text-xs font-semibold mb-1.5 leading-snug ${colors.titleColor}`}>
          {stage.headline}
        </h5>

        {/* Stage Summary Description */}
        <p className="text-xs text-cream-300/85 leading-relaxed mb-3.5 font-sans">
          {stage.summary}
        </p>

        {/* Vagueness Callout if applicable */}
        {stage.status === 'vague' && stage.vaguenessReason && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200/90 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Ambiguity Notice: </span>
              <span>{stage.vaguenessReason}</span>
            </div>
          </div>
        )}

        {/* Primary Verbatim Quote Preview (Warm Cream Typography) */}
        {primaryEvidence ? (
          <div className="p-3.5 rounded-2xl bg-[#0A060C] border border-[#2A162F] mb-4 group-hover:border-burgundy-900 transition">
            <div className="flex items-center justify-between text-[10px] font-mono text-cream-500 mb-1.5">
              <span className="flex items-center gap-1 text-teal-300">
                <Quote className="w-3 h-3" />
                <span>Verbatim Policy Claim</span>
              </span>
              {primaryEvidence.lineNumber && (
                <span className="text-cream-500">Line ~{primaryEvidence.lineNumber}</span>
              )}
            </div>
            <p className="text-xs font-mono text-cream-100 leading-relaxed italic line-clamp-3">
              "{primaryEvidence.quote}"
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#0A060C]/60 border border-dashed border-[#26152B] mb-4 text-center">
            <p className="text-xs text-cream-500 italic font-sans">
              No matching clause found in the submitted text.
            </p>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="pt-2.5 border-t border-[#26152B] flex items-center justify-between">
        <span className="text-[10px] text-cream-500 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-cream-500" />
          <span>{stage.evidence.length} clause{stage.evidence.length === 1 ? '' : 's'} verified</span>
        </span>

        <button
          onClick={() => onOpenEvidence(stage)}
          className="text-xs font-medium text-teal-300 hover:text-teal-200 transition flex items-center gap-1 px-3 py-1 rounded-xl hover:bg-teal-950/40"
        >
          <Search className="w-3 h-3" />
          <span>Inspect Evidence →</span>
        </button>
      </div>
    </div>
  );
};

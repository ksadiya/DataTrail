import React from 'react';
import { DataTypeTrail, TrailStage } from '../types/policy';
import { TrailNodeCard } from './TrailNodeCard';
import { ArrowRight, Compass, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface TrailBoardProps {
  trail: DataTypeTrail;
  onOpenEvidence: (stage: TrailStage) => void;
  activeStageKey?: string;
}

export const TrailBoard: React.FC<TrailBoardProps> = ({
  trail,
  onOpenEvidence,
  activeStageKey
}) => {
  const stagesList = [
    { key: 'collect', stage: trail.stages.collect, num: 1 },
    { key: 'use', stage: trail.stages.use, num: 2 },
    { key: 'share', stage: trail.stages.share, num: 3 },
    { key: 'keep', stage: trail.stages.keep, num: 4 },
  ];

  return (
    <div className="bg-[#140C16] border border-[#2E1B33] rounded-3xl p-6 lg:p-8 shadow-2xl shadow-black/70 mb-8 relative overflow-hidden transition-colors">
      {/* Background ambient lighting in burgundy & teal */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-burgundy-900/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-900/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Board Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#26152B] pb-6 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-lg border border-teal-800/40 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-teal-300 animate-spin-slow" />
              <span>Personal Data Lifecycle Trail</span>
            </span>
            <span className="text-xs text-cream-500 font-mono">
              Category: {trail.categoryName}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-cream-100 tracking-tight flex items-center gap-3 font-sans">
            <span>{trail.label}</span>
          </h2>
          <p className="text-xs sm:text-sm text-cream-300/85 max-w-2xl mt-1.5 leading-relaxed font-sans">
            {trail.description}
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono bg-[#0A060C]/90 p-2 rounded-2xl border border-[#2E1B33]">
          <span className="text-cream-400 px-1 font-semibold">Honesty Schema:</span>
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Stated</span>
          </span>
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/50">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Vague / Hedge</span>
          </span>
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#180F1D] text-cream-400 border border-[#331C38]">
            <HelpCircle className="w-3 h-3 text-cream-500" />
            <span>Not Found</span>
          </span>
        </div>
      </div>

      {/* Visual Conduit Flow Banner */}
      <div className="hidden lg:flex items-center justify-between mb-4 px-6 text-xs font-mono font-semibold text-cream-400">
        <div className="flex items-center gap-2 text-teal-300">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm shadow-teal-400"></span>
          <span>1. COLLECT (Ingestion)</span>
        </div>
        <ArrowRight className="w-4 h-4 text-burgundy-600 animate-pulse" />
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
          <span>2. USE (Operations)</span>
        </div>
        <ArrowRight className="w-4 h-4 text-burgundy-600 animate-pulse" />
        <div className="flex items-center gap-2 text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
          <span>3. SHARE (Third Parties)</span>
        </div>
        <ArrowRight className="w-4 h-4 text-burgundy-600 animate-pulse" />
        <div className="flex items-center gap-2 text-burgundy-400">
          <span className="w-2.5 h-2.5 rounded-full bg-burgundy-400 shadow-sm shadow-burgundy-400"></span>
          <span>4. KEEP (Retention)</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {stagesList.map(({ key, stage, num }) => (
          <TrailNodeCard
            key={key}
            stage={stage}
            stageNumber={num}
            onOpenEvidence={onOpenEvidence}
            isActive={activeStageKey === key}
          />
        ))}
      </div>

      {/* Trail takeaway bar */}
      <div className="mt-8 pt-4 border-t border-[#26152B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cream-400">
        <div className="flex items-center gap-2 font-sans">
          <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
          <span>
            Trail Completeness: <strong className="text-cream-100 font-mono">{trail.metrics.statedStages}/4 stages explicitly stated</strong>
            {trail.metrics.vagueStages > 0 && (
              <span>, <strong className="text-amber-300 font-mono">{trail.metrics.vagueStages} stage{trail.metrics.vagueStages === 1 ? '' : 's'} vague</strong></span>
            )}
            {trail.metrics.missingStages > 0 && (
              <span>, <strong className="text-cream-400 font-mono">{trail.metrics.missingStages} omitted</strong></span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-cream-500 font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Click any card to inspect full verbatim policy clauses</span>
        </div>
      </div>
    </div>
  );
};

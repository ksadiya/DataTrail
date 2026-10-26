import React from 'react';
import { DataTypeTrail } from '../types/policy';
import { Sparkles, AlertCircle, Info, Scale } from 'lucide-react';

interface NecessityCardProps {
  trail: DataTypeTrail;
}

export const NecessityCard: React.FC<NecessityCardProps> = ({ trail }) => {
  const { necessityNote } = trail;

  const getStatusBadge = () => {
    switch (necessityNote.status) {
      case 'proportional':
        return {
          label: 'Proportional Scope',
          style: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
        };
      case 'vague_justification':
        return {
          label: 'Ambiguous Scope',
          style: 'bg-amber-950/80 text-amber-300 border-amber-800/50'
        };
      case 'excessive_scope':
        return {
          label: 'Broad Scope Justification',
          style: 'bg-burgundy-950 text-burgundy-300 border-burgundy-800/60'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="bg-[#140C16] border border-[#2E1B33] rounded-3xl p-6 lg:p-8 mb-8 shadow-xl relative overflow-hidden transition-colors">
      {/* Decorative accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#26152B] pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-burgundy-950/80 border border-burgundy-700/50 flex items-center justify-center text-burgundy-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-burgundy-950 text-burgundy-300 border border-burgundy-700/60">
                Analytical Interpretation
              </span>
              <span className="text-xs text-cream-400/70 font-mono">
                Not a Direct Policy Claim
              </span>
            </div>
            <h3 className="text-lg font-bold text-cream-100 font-sans tracking-tight mt-0.5">
              Necessity & Proportionality Assessment
            </h3>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border self-start sm:self-auto ${badge.style}`}>
          {badge.label}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Core Utility Connection */}
        <div className="p-4 rounded-2xl bg-[#0A060C] border border-[#26152B]">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-300 font-semibold mb-2">
            <Info className="w-3.5 h-3.5" />
            <span>Connection to Core App Utility</span>
          </div>
          <p className="text-xs text-cream-200/90 leading-relaxed font-sans">
            {necessityNote.coreUtilityRelation}
          </p>
        </div>

        {/* Proportionality Analysis */}
        <div className="p-4 rounded-2xl bg-[#0A060C] border border-[#26152B]">
          <div className="flex items-center gap-2 text-xs font-mono text-burgundy-300 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evaluation of Collection & Sharing Scope</span>
          </div>
          <p className="text-xs text-cream-200/90 leading-relaxed font-sans">
            {necessityNote.proportionalityAssessment}
          </p>
        </div>
      </div>

      {/* Uncertainty & Runtime Transparency Banner */}
      <div className="p-4 rounded-2xl bg-[#0A060C]/70 border border-[#26152B] text-xs text-cream-400 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 font-sans">
          <p className="font-semibold text-cream-200">
            Transparency Note Regarding Runtime Uncertainty
          </p>
          <p className="text-cream-400/80 leading-relaxed">
            A privacy policy represents an organization’s formal legal claims and statutory disclosures. It does not measure actual software runtime execution, background device sensors, or encrypted TLS socket traffic. DataTrail never invents guarantees about what an application actually does behind closed doors.
          </p>
        </div>
      </div>
    </div>
  );
};

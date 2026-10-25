import React from 'react';
import { PolicyAnalysisResult } from '../types/policy';
import { ShieldCheck, Mail, MapPin, UserCheck, Trash2, HelpCircle, AlertCircle, Quote } from 'lucide-react';

interface RightsPanelProps {
  analysis: PolicyAnalysisResult;
  onJumpToQuote: (quote: string) => void;
}

export const RightsPanel: React.FC<RightsPanelProps> = ({
  analysis,
  onJumpToQuote
}) => {
  const { rightsAndContacts } = analysis;

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 lg:p-8 mb-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/40">
              Disclosed Contacts & Safeguards
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Statutory Redressal
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 font-sans tracking-tight">
            Data Subject Rights & Grievance Contacts
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Explicit channels stated in the policy for exercising deletion, access, or formal complaints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {rightsAndContacts.grievanceOfficerFound ? (
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grievance Officer Stated</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>No Grievance Officer Found</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Grievance Officer Box */}
        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-3">
              <UserCheck className="w-4 h-4" />
              <span>Grievance Officer Details</span>
            </div>

            {rightsAndContacts.grievanceOfficerFound ? (
              <div className="space-y-2 text-xs">
                {rightsAndContacts.grievanceOfficerName && (
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono">Designated Officer:</span>
                    <strong className="text-slate-100">{rightsAndContacts.grievanceOfficerName}</strong>
                  </div>
                )}
                {rightsAndContacts.grievanceOfficerEmail && (
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono">
                    <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{rightsAndContacts.grievanceOfficerEmail}</span>
                  </div>
                )}
                {rightsAndContacts.grievanceOfficerAddress && (
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-[11px]">{rightsAndContacts.grievanceOfficerAddress}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                The policy does not name a specific grievance officer or data ombudsman.
              </p>
            )}
          </div>
        </div>

        {/* Deletion & Erasure Mechanism */}
        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-3">
              <Trash2 className="w-4 h-4" />
              <span>Account & Data Deletion</span>
            </div>

            {rightsAndContacts.deletionProcedureStated ? (
              <div className="space-y-2 text-xs text-slate-300">
                <p className="leading-relaxed">
                  {rightsAndContacts.deletionSummary}
                </p>
                <div className="pt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Deletion mechanism explicitly declared</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-400">
                <p className="italic">
                  No clear data deletion or account erasure procedure identified in the analyzed text.
                </p>
                <div className="pt-2 text-[10px] font-mono text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Missing explicit erasure instructions</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Policy Hedges Discovered */}
        <div className="p-4 rounded-2xl bg-[#090D16] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>Policy-Wide Legal Discretion Hedges</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {analysis.hedgesDetected.length > 0 ? (
                analysis.hedgesDetected.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-900 border border-slate-800/80">
                    <span className="font-mono text-slate-300 truncate max-w-[170px]">
                      "{h.phrase}"
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                      {h.count}x
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Minimal discretionary hedging detected.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Discovered Rights Evidence Quotes */}
      {rightsAndContacts.evidenceQuotes.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
            Extracted Policy Clauses for Rights & Redressal:
          </span>
          <div className="space-y-2">
            {rightsAndContacts.evidenceQuotes.map((q, idx) => (
              <div
                key={idx}
                onClick={() => onJumpToQuote(q)}
                className="cursor-pointer p-3 rounded-xl bg-[#090D16] border border-slate-800/80 hover:border-cyan-500/50 transition flex items-start gap-2.5 group"
              >
                <Quote className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-slate-300 group-hover:text-cyan-200 transition line-clamp-2">
                  "{q}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

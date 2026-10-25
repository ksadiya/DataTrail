import React from 'react';
import { DataTypeTrail } from '../types/policy';
import {
  MapPin,
  Users,
  Smartphone,
  CreditCard,
  MessageSquare,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

interface DataTypeSelectorProps {
  dataTypes: DataTypeTrail[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const DataTypeSelector: React.FC<DataTypeSelectorProps> = ({
  dataTypes,
  selectedId,
  onSelect
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'MapPin': return <MapPin className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      case 'Fingerprint': return <Fingerprint className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Stage 1: Choose Data Category
          </span>
          <h3 className="text-base font-bold text-slate-100">
            Discovered Personal Data Types ({dataTypes.length})
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Select one data type to follow its 4-stage journey across the policy:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dataTypes.map((type) => {
          const isSelected = type.id === selectedId;
          const { statedStages, vagueStages, missingStages } = type.metrics;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-[#0F172A]/70 border-[#1E293B] hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-lg transition ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {getIcon(type.iconName)}
                    </span>
                    <span className="font-semibold text-xs text-slate-100 group-hover:text-cyan-300 transition">
                      {type.label}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 font-sans">
                  {type.description}
                </p>
              </div>

              {/* Stage breakdown chips */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <span className="text-slate-400">{type.categoryName.split(' ')[0]}</span>
                <div className="flex items-center gap-1.5">
                  {statedStages > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-400" title={`${statedStages} stated claims`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{statedStages}</span>
                    </span>
                  )}
                  {vagueStages > 0 && (
                    <span className="flex items-center gap-0.5 text-amber-400" title={`${vagueStages} vague clauses`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>{vagueStages}</span>
                    </span>
                  )}
                  {missingStages > 0 && (
                    <span className="flex items-center gap-0.5 text-slate-500" title={`${missingStages} stages not found`}>
                      <HelpCircle className="w-3 h-3" />
                      <span>{missingStages}</span>
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

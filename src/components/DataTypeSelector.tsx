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
  HelpCircle,
  Layers
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

  if (dataTypes.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-1.5 mb-0.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Step 1 • Select Personal Data Category</span>
          </span>
          <h3 className="text-base font-bold text-cream-100 font-sans">
            Discovered Personal Data Types ({dataTypes.length})
          </h3>
        </div>
        <p className="text-xs text-cream-400/80 font-sans">
          Click any category to follow its dedicated 4-stage data trail:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {dataTypes.map((type) => {
          const isSelected = type.id === selectedId;
          const { statedStages, vagueStages, missingStages } = type.metrics;

          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#221025] border-teal-500 shadow-xl shadow-teal-950/40 ring-1 ring-teal-500/60'
                  : 'bg-[#140C16] border-[#2E1B33] hover:border-burgundy-700/80 hover:bg-[#1A101E]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`p-2 rounded-xl transition ${
                        isSelected
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-[#1F1323] text-cream-400 group-hover:text-cream-100 border border-[#2E1B33]'
                      }`}
                    >
                      {getIcon(type.iconName)}
                    </span>
                    <span className="font-semibold text-xs text-cream-100 group-hover:text-teal-300 transition">
                      {type.label}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-sm shadow-teal-400"></span>
                  )}
                </div>

                <p className="text-[11px] text-cream-400/80 line-clamp-1 mb-3 font-sans">
                  {type.description}
                </p>
              </div>

              {/* Stage breakdown chips */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#26152B] text-[10px] font-mono">
                <span className="text-cream-500">{type.categoryName.split(' ')[0]}</span>
                <div className="flex items-center gap-2">
                  {statedStages > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-400" title={`${statedStages} stated claims`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{statedStages} Stated</span>
                    </span>
                  )}
                  {vagueStages > 0 && (
                    <span className="flex items-center gap-0.5 text-amber-400" title={`${vagueStages} vague clauses`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>{vagueStages} Vague</span>
                    </span>
                  )}
                  {missingStages > 0 && (
                    <span className="flex items-center gap-0.5 text-cream-500" title={`${missingStages} stages not found`}>
                      <HelpCircle className="w-3 h-3" />
                      <span>{missingStages} Omitted</span>
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

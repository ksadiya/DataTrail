import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Copy, Check, FileText } from 'lucide-react';

interface PolicyTextInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  policyTitle: string;
  targetQuote?: string | null;
}

export const PolicyTextInspector: React.FC<PolicyTextInspectorProps> = ({
  isOpen,
  onClose,
  rawText,
  policyTitle,
  targetQuote
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetQuote) {
      setSearchQuery(targetQuote.slice(0, 40));
    }
  }, [targetQuote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split text by lines
  const lines = rawText.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0F172A] border border-[#1E293B] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1E293B] bg-[#090D16] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Policy Document Inspector
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {policyTitle} • {lines.length} lines • {rawText.split(/\s+/).filter(Boolean).length.toLocaleString()} words
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 transition border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-[#090D16]/60 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by keyword or clause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090D16] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200 font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Text Container with Line Numbers */}
        <div
          ref={textContainerRef}
          className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed space-y-1 bg-[#090D16]/95"
        >
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isMatch = searchQuery.trim().length > 2 && line.toLowerCase().includes(searchQuery.toLowerCase());
            const isTarget = targetQuote && line.toLowerCase().includes(targetQuote.slice(0, 30).toLowerCase());

            return (
              <div
                key={idx}
                className={`flex items-start gap-4 py-0.5 px-2 rounded transition ${
                  isTarget
                    ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-200'
                    : isMatch
                    ? 'bg-amber-950/50 border border-amber-600/40 text-amber-200'
                    : 'hover:bg-slate-900/50 text-slate-300'
                }`}
              >
                <span className="text-[10px] text-slate-400 select-none w-10 text-right shrink-0 pt-0.5">
                  {lineNum}
                </span>
                <span className="flex-1 break-words whitespace-pre-wrap">
                  {line || <span className="opacity-0">empty</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

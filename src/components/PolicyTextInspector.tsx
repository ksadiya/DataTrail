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
      setSearchQuery(targetQuote.slice(0, 35));
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

  const lines = rawText.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#140C16] border border-[#2E1B33] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#26152B] bg-[#0E0810] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-burgundy-950/80 border border-burgundy-700/60 text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cream-100 tracking-tight font-sans">
                Full Policy Text Inspector
              </h3>
              <p className="text-xs text-cream-500 font-mono">
                {policyTitle} • {lines.length} lines • {rawText.split(/\s+/).filter(Boolean).length.toLocaleString()} words
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#221326] hover:bg-[#2C1832] text-cream-200 text-xs font-mono transition border border-[#331C38]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-cream-400 hover:text-white bg-[#1C1220] hover:bg-burgundy-900/60 transition border border-[#2E1B33]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3 border-b border-[#26152B] bg-[#0A060C] flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cream-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by keyword or clause to inspect exact context..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#140C16] border border-[#2E1B33] rounded-xl pl-9 pr-4 py-2 text-xs text-cream-100 placeholder:text-cream-600 focus:outline-none focus:border-teal-500/70 font-mono"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-cream-400 hover:text-cream-200 font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Text Container with Line Numbers */}
        <div
          ref={textContainerRef}
          className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-relaxed space-y-1 bg-[#0A060C]"
        >
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isMatch = searchQuery.trim().length > 2 && line.toLowerCase().includes(searchQuery.toLowerCase());
            const isTarget = targetQuote && line.toLowerCase().includes(targetQuote.slice(0, 25).toLowerCase());

            return (
              <div
                key={idx}
                className={`flex items-start gap-4 py-0.5 px-2.5 rounded transition ${
                  isTarget
                    ? 'bg-teal-950/80 border border-teal-500/60 text-teal-200'
                    : isMatch
                    ? 'bg-amber-950/50 border border-amber-600/40 text-amber-200'
                    : 'hover:bg-[#150D18] text-cream-300'
                }`}
              >
                <span className="text-[10px] text-cream-600 select-none w-10 text-right shrink-0 pt-0.5">
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

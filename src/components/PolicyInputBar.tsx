import React, { useState } from 'react';
import { SAMPLE_POLICIES } from '../data/samples';
import { PolicySample } from '../types/policy';
import { Search, Sparkles, Clipboard, Upload, Globe, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface PolicyInputBarProps {
  onAnalyzeText: (text: string, title: string) => void;
  isAnalyzing: boolean;
  currentTitle: string;
}

export const PolicyInputBar: React.FC<PolicyInputBarProps> = ({
  onAnalyzeText,
  isAnalyzing,
  currentTitle
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'paste' | 'upload' | 'url'>('samples');
  const [customText, setCustomText] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('swiggy');

  const wordCount = customText.trim().split(/\s+/).filter(Boolean).length;

  const handleSelectSample = (sample: PolicySample) => {
    setSelectedSampleId(sample.id);
    onAnalyzeText(sample.text, sample.name);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const title = customTitle.trim() || 'Custom Privacy Policy';
    onAnalyzeText(customText, title);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      alert('Please upload a plain text (.txt) document for direct parsing.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomText(content);
        setCustomTitle(file.name.replace('.txt', ''));
        setActiveTab('paste');
      }
    };
    reader.readAsText(file);
  };

  const handleUrlFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setUrlError(null);
    setIsFetchingUrl(true);

    try {
      // In browser environment, cross-origin fetch is subject to CORS restrictions
      // We attempt a fetch, and honestly explain CORS if blocked.
      const response = await fetch(urlInput.trim(), {
        headers: { 'Accept': 'text/html, text/plain' }
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const htmlOrText = await response.text();
      // Strip basic HTML tags if it returned HTML
      const cleaned = htmlOrText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleaned.length < 150) {
        throw new Error("Extracted text was too sparse or blocked by anti-bot verification.");
      }

      setCustomText(cleaned);
      let derivedTitle = 'Fetched Policy';
      try {
        const u = new URL(urlInput);
        derivedTitle = `${u.hostname} Policy`;
      } catch {
        derivedTitle = 'URL Policy';
      }
      setCustomTitle(derivedTitle);
      setActiveTab('paste');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Cross-origin request failed';
      setUrlError(
        `Unable to fetch directly from browser due to remote domain CORS protection or paywall (${message}). We recommend copying the text and pasting it into the "Paste Custom Text" tab.`
      );
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl shadow-black/40 mb-8">
      {/* Top tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-4 mb-5">
        <div className="flex items-center gap-1.5 p-1 bg-[#090D16] rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'samples'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real India Samples</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'paste'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste Policy Text</span>
            {customText.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload .txt</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'url'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Fetch URL</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span>Active Investigation:</span>
          <span className="font-semibold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/50">
            {currentTitle || 'No policy loaded'}
          </span>
        </div>
      </div>

      {/* Tab 1: Real India Samples */}
      {activeTab === 'samples' && (
        <div>
          <div className="text-xs text-slate-400 mb-3">
            Select a verified in-repo privacy policy to inspect how real platforms declare data movement under Indian & global privacy norms:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {SAMPLE_POLICIES.map((sample) => {
              const isSelected = selectedSampleId === sample.id && currentTitle.includes(sample.name.split(' ')[0]);
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`cursor-pointer rounded-xl p-4 border text-left transition relative group ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                      : 'bg-[#090D16]/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-100 group-hover:text-cyan-300 transition">
                        {sample.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-sans">{sample.subtitle}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {sample.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono">
                      {sample.category}
                    </span>
                    <span className="text-cyan-400/90 font-medium group-hover:translate-x-0.5 transition inline-flex items-center gap-1">
                      {isSelected ? 'Currently Loaded' : 'Load Policy →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Paste Custom Policy */}
      {activeTab === 'paste' && (
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Policy / App Name (e.g. Uber, Blinkit, TikTok, Reddit)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="bg-[#090D16] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 flex-1 font-sans"
            />
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{customText.length} characters</span>
            </div>
          </div>

          <textarea
            rows={5}
            placeholder="Paste complete or partial privacy policy text here... DataTrail will parse clauses, extract exact quotes, identify vague hedges, and construct the 4-stage Collect → Use → Share → Keep trail."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 font-mono resize-y"
          ></textarea>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCustomText(SAMPLE_POLICIES[0].text);
                  setCustomTitle(SAMPLE_POLICIES[0].name);
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Fill with Swiggy text for testing
              </button>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || wordCount < 30}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                wordCount < 30
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Analyzing Text...' : 'Investigate Policy'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Upload Text File */}
      {activeTab === 'upload' && (
        <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center bg-[#090D16]/40 hover:border-cyan-500/50 transition">
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3 opacity-80" />
          <h4 className="text-sm font-semibold text-slate-200 mb-1">Upload Digital Privacy Policy</h4>
          <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
            Select a raw <code className="text-cyan-300 font-mono">.txt</code> file containing a real privacy policy. (Per hackathon scope, scanned image PDFs require OCR and are explicitly cut from v1).
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition">
            <span>Select .txt File</span>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Tab 4: Fetch URL */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlFetch} className="space-y-3">
          <div className="text-xs text-slate-400">
            Enter a direct privacy policy URL. <em>Note:</em> Many commercial websites enforce CORS headers or anti-bot Cloudflare screens that block browser-based web fetches. DataTrail reports network blocks honestly.
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/privacy-policy"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="bg-[#090D16] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 flex-1 font-mono"
            />
            <button
              type="submit"
              disabled={isFetchingUrl || !urlInput.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isFetchingUrl ? 'Fetching...' : 'Fetch & Analyze'}</span>
            </button>
          </div>

          {urlError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Network & Fetch Limitation</p>
                <p className="text-rose-200/80 leading-relaxed">{urlError}</p>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

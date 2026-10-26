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
      const response = await fetch(urlInput.trim(), {
        headers: { 'Accept': 'text/html, text/plain' }
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const htmlOrText = await response.text();
      const cleaned = htmlOrText
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
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
        `Unable to fetch directly from browser due to remote domain CORS protection or Cloudflare shielding (${message}). Please copy the policy text directly and paste it into the "Paste Policy Text" tab.`
      );
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <div className="bg-[#140C16] border border-[#2E1B33] rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/60 mb-8 transition-colors">
      {/* Top tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#26152B] pb-4 mb-5">
        <div className="flex items-center gap-1.5 p-1 bg-[#0A060C] rounded-2xl border border-[#2B1830]">
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'samples'
                ? 'bg-burgundy-900/80 text-cream-100 border border-burgundy-600/70 shadow-sm'
                : 'text-cream-400/80 hover:text-cream-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Real Policy Samples</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'paste'
                ? 'bg-burgundy-900/80 text-cream-100 border border-burgundy-600/70 shadow-sm'
                : 'text-cream-400/80 hover:text-cream-100'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5 text-teal-300" />
            <span>Paste Policy Text</span>
            {customText.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'upload'
                ? 'bg-burgundy-900/80 text-cream-100 border border-burgundy-600/70 shadow-sm'
                : 'text-cream-400/80 hover:text-cream-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-teal-300" />
            <span>Upload .txt</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'url'
                ? 'bg-burgundy-900/80 text-cream-100 border border-burgundy-600/70 shadow-sm'
                : 'text-cream-400/80 hover:text-cream-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-teal-300" />
            <span>Fetch URL</span>
          </button>
        </div>

        <div className="text-xs text-cream-400/80 flex items-center gap-2 font-mono">
          <span className="text-cream-500">Active Policy:</span>
          <span className="font-semibold text-teal-300 bg-[#1D1222] px-3 py-1 rounded-lg border border-teal-800/40">
            {currentTitle || 'No policy loaded'}
          </span>
        </div>
      </div>

      {/* Tab 1: Real India Samples */}
      {activeTab === 'samples' && (
        <div>
          <div className="text-xs text-cream-400/80 mb-3.5 flex items-center justify-between">
            <span>Select an authentic consumer tech policy to inspect genuine data movement claims:</span>
            <span className="text-[11px] font-mono text-teal-400">All samples pass through the same analyzer</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {SAMPLE_POLICIES.map((sample) => {
              const isSelected = selectedSampleId === sample.id && currentTitle.includes(sample.name.split(' ')[0]);
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`cursor-pointer rounded-2xl p-4 border text-left transition-all relative group ${
                    isSelected
                      ? 'bg-[#221025] border-teal-500/80 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/50'
                      : 'bg-[#0E0810]/70 border-[#26152B] hover:border-burgundy-800/80 hover:bg-[#1A101E]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-sm text-cream-100 group-hover:text-teal-300 transition">
                        {sample.name}
                      </h4>
                      <p className="text-[11px] text-cream-400/80 font-sans mt-0.5">{sample.subtitle}</p>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-burgundy-800 group-hover:bg-teal-500 transition shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-cream-300/70 line-clamp-2 mb-3.5 leading-relaxed font-sans">
                    {sample.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-cream-400 border-t border-[#26152B] pt-2.5 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#180F1D] text-cream-400 text-[10px] border border-[#2E1A33]">
                      {sample.category}
                    </span>
                    <span className="text-teal-300 font-medium group-hover:translate-x-0.5 transition inline-flex items-center gap-1 text-[11px]">
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
        <form onSubmit={handleCustomSubmit} className="space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Application or Service Name (e.g. Uber, Blinkit, TikTok, Reddit, Instagram)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="bg-[#0A060C] border border-[#2E1B33] rounded-xl px-4 py-2 text-xs text-cream-100 placeholder:text-cream-600 focus:outline-none focus:border-teal-500/70 flex-1 font-sans"
            />
            <div className="flex items-center gap-2 text-xs font-mono text-cream-400 bg-[#0E0810] px-3 py-1.5 rounded-xl border border-[#26152B]">
              <span className="text-teal-300 font-semibold">{wordCount}</span> words
              <span>•</span>
              <span>{customText.length.toLocaleString()}</span> chars
            </div>
          </div>

          <textarea
            rows={5}
            placeholder="Paste complete or excerpted privacy policy text here... DataTrail will parse clauses, extract exact verbatim quotes, evaluate vague qualifiers, and construct the interactive 4-stage Collect → Use → Share → Keep trail."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full bg-[#0A060C] border border-[#2E1B33] rounded-2xl p-4 text-xs text-cream-200 placeholder:text-cream-600 focus:outline-none focus:border-teal-500/70 font-mono resize-y leading-relaxed"
          ></textarea>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setCustomText(SAMPLE_POLICIES[0].text);
                setCustomTitle(SAMPLE_POLICIES[0].name);
              }}
              className="text-[11px] text-teal-400 hover:text-teal-300 underline flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              Fill with Swiggy text for testing
            </button>

            <button
              type="submit"
              disabled={isAnalyzing || wordCount < 10}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                wordCount < 10
                  ? 'bg-[#1C1220] text-cream-600 cursor-not-allowed border border-[#26152B]'
                  : 'bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 shadow-teal-500/20'
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
        <div className="border-2 border-dashed border-[#2E1B33] rounded-2xl p-8 text-center bg-[#0E0810]/50 hover:border-teal-500/60 transition">
          <Upload className="w-8 h-8 text-teal-400 mx-auto mb-3 opacity-90" />
          <h4 className="text-sm font-semibold text-cream-100 mb-1">Upload Digital Privacy Policy</h4>
          <p className="text-xs text-cream-400 max-w-md mx-auto mb-4 font-sans leading-relaxed">
            Select a raw <code className="text-teal-300 font-mono">.txt</code> file containing an authentic privacy policy. (Per hackathon scope, scanned image PDFs require OCR and are explicitly cut from v1).
          </p>
          <label className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-burgundy-900 hover:bg-burgundy-800 text-cream-100 text-xs font-semibold cursor-pointer border border-burgundy-700 transition">
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
        <form onSubmit={handleUrlFetch} className="space-y-3.5">
          <div className="text-xs text-cream-400/90 leading-relaxed font-sans">
            Enter a direct privacy policy URL. <em>Note:</em> Many commercial websites enforce CORS headers or anti-bot Cloudflare screens that block browser-based web fetches. DataTrail reports network blocks honestly and provides instant paste fallback.
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/privacy-policy"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="bg-[#0A060C] border border-[#2E1B33] rounded-xl px-4 py-2 text-xs text-cream-100 placeholder:text-cream-600 focus:outline-none focus:border-teal-500/70 flex-1 font-mono"
            />
            <button
              type="submit"
              disabled={isFetchingUrl || !urlInput.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 shadow-md shadow-teal-500/20"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isFetchingUrl ? 'Fetching...' : 'Fetch & Analyze'}</span>
            </button>
          </div>

          {urlError && (
            <div className="p-3.5 rounded-xl bg-[#2D0D19] border border-burgundy-700/60 text-xs text-cream-200 flex items-start gap-2.5 font-sans">
              <AlertTriangle className="w-4 h-4 text-burgundy-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-cream-100 mb-1">Network & Fetch Limitation</p>
                <p className="text-cream-300/80 leading-relaxed">{urlError}</p>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

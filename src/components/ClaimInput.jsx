import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  HelpCircle, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';

const SUGGESTIONS = [
  "This product contains 80% recycled material.",
  "This product contains 80% recycled material and its packaging is recyclable.",
  "Our enterprise cloud platform achieves 99.99% uptime and zero unpatched CVE vulnerabilities.",
  "The electric vehicle delivers 420 miles range and fast-charges in under 20 minutes."
];

export default function ClaimInput({ 
  claimText, 
  setClaimText, 
  onAnalyze, 
  isAnalyzing, 
  hasSubclaims 
}) {
  const [error, setError] = useState('');

  const handleAnalyze = (e) => {
    e?.preventDefault();
    if (!claimText.trim()) {
      setError('Please enter a claim statement to analyze.');
      return;
    }
    if (claimText.trim().length < 8) {
      setError('Please enter a more descriptive claim (at least 8 characters).');
      return;
    }
    setError('');
    onAnalyze();
  };

  const handleClear = () => {
    setClaimText('');
    setError('');
  };

  const selectSuggestion = (text) => {
    setClaimText(text);
    setError('');
  };

  return (
    <div id="claim-input-section" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
              1
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Enter Claim to Verify
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Input a marketing claim, factual assertion, or scientific statement you wish to audit.
          </p>
        </div>

        {claimText && (
          <button
            onClick={handleClear}
            className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors py-1 px-2 rounded-md hover:bg-rose-50"
            title="Clear claim text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="relative">
          <textarea
            value={claimText}
            onChange={(e) => {
              setClaimText(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. This product contains 80% recycled material and its packaging is recyclable."
            rows={3}
            className={`w-full rounded-xl p-4 text-sm sm:text-base text-slate-900 bg-slate-50/70 border ${
              error ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100'
            } focus:outline-hidden focus:ring-4 focus:bg-white transition-all resize-y placeholder:text-slate-400 leading-relaxed font-normal`}
          />
          <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-400">
            {claimText.length} chars
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Example claims:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((item, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => selectSuggestion(item)}
                className="text-left text-xs px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-brand-50 text-slate-600 hover:text-brand-700 hover:border-brand-200 border border-transparent transition-all truncate max-w-full sm:max-w-md"
              >
                "{item}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deconstructs statement into 2–4 testable subclaims.</span>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deconstructing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{hasSubclaims ? 'Re-analyze Claim' : 'Analyze Claim'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

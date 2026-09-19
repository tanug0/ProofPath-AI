import React, { useState } from 'react';
import { 
  Plus, 
  Link, 
  Building, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import EvidenceItem from './EvidenceItem';

export default function EvidenceWorkspace({ 
  subclaim, 
  onAddEvidence, 
  onDeleteEvidence 
}) {
  const [evidenceText, setEvidenceText] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(subclaim.evidenceList.length === 0);
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e?.preventDefault();
    if (!evidenceText.trim()) {
      setError('Please provide the evidence statement or excerpt.');
      return;
    }

    if (sourceUrl.trim() && !/^https?:\/\//i.test(sourceUrl.trim())) {
      // Auto-prefix http if missing
      setSourceUrl(`https://${sourceUrl.trim()}`);
    }

    onAddEvidence(subclaim.id, {
      text: evidenceText.trim(),
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim() ? (sourceUrl.startsWith('http') ? sourceUrl.trim() : `https://${sourceUrl.trim()}`) : '',
      addedAt: new Date().toISOString()
    });

    // Reset form
    setEvidenceText('');
    setSourceName('');
    setSourceUrl('');
    setError('');
    setShowAddForm(false);
  };

  const evidenceItems = subclaim.evidenceList || [];
  const evaluations = subclaim.evaluations || [];

  return (
    <div className="space-y-4 pt-3">
      
      {/* List of current evidence items */}
      {evidenceItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Attached Evidence Records ({evidenceItems.length})</span>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 capitalize"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Another Item
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {evidenceItems.map((item, idx) => {
              const evalObj = evaluations.find(e => e.evidence.id === item.id)?.evaluation;
              return (
                <EvidenceItem
                  key={item.id || idx}
                  evidence={item}
                  evaluation={evalObj}
                  subclaimKeywords={subclaim.keywords}
                  onDelete={() => onDeleteEvidence(subclaim.id, item.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Add Evidence Form */}
      {showAddForm ? (
        <div className="bg-slate-50/90 rounded-xl border border-dashed border-slate-300 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              Add Evidence for Subclaim
            </span>
            {evidenceItems.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evidence Text / Excerpt <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={evidenceText}
                onChange={(e) => {
                  setEvidenceText(e.target.value);
                  if (error) setError('');
                }}
                rows={2}
                placeholder="Paste relevant audit findings, quotes, lab specs, data points, or documentation..."
                className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  Source Name <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. UL Certification Report 2024"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Link className="w-3 h-3 text-slate-400" />
                  Source URL <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://example.com/audit-report.pdf"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" />
                Evaluated immediately via transparent local logic
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Evidence
              </button>
            </div>
          </form>
        </div>
      ) : (
        evidenceItems.length === 0 && (
          <div className="text-center py-5 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-2">
              No evidence has been attached to this subclaim yet.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Evidence
            </button>
          </div>
        )
      )}

    </div>
  );
}

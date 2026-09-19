import React from 'react';
import { 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  Link,
  Award
} from 'lucide-react';
import { SUBCLAIM_STATUS, STATUS_CONFIG } from '../constants/statusTypes';

export default function EvidenceItem({ 
  evidence, 
  evaluation, 
  onDelete, 
  subclaimKeywords = [] 
}) {
  const status = evaluation?.status || SUBCLAIM_STATUS.MISSING;
  const score = evaluation?.score || 0;
  const rationale = evaluation?.rationale || [];
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG[SUBCLAIM_STATUS.MISSING];

  // Helper to highlight matching keywords in evidence text
  const renderHighlightedText = (text) => {
    if (!text) return null;
    if (!subclaimKeywords || subclaimKeywords.length === 0) return text;

    // Create a regex to find all keyword matches
    const escapedKeywords = subclaimKeywords
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter(k => k.length > 2);

    if (escapedKeywords.length === 0) return text;

    const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = escapedKeywords.some(k => k.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark 
            key={index} 
            className="bg-brand-100 text-brand-900 font-medium px-1 py-0.5 rounded-xs"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3">
      
      {/* Top row: Status, Score & Delete */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeBg}`}>
            {status === SUBCLAIM_STATUS.SUPPORTED && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
            {status === SUBCLAIM_STATUS.PARTIALLY_SUPPORTED && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
            {status === SUBCLAIM_STATUS.CONTRADICTED && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
            {status === SUBCLAIM_STATUS.MISSING && <HelpCircle className="w-3.5 h-3.5 text-slate-500" />}
            <span>{statusInfo.label}</span>
          </span>

          {/* Strength Score pill */}
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            {score} / 100 pts
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
          title="Remove this evidence item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Evidence Text */}
      <div className="text-sm text-slate-800 leading-relaxed pl-2 border-l-2 border-slate-300">
        "{renderHighlightedText(evidence.text)}"
      </div>

      {/* Source Citation & Provenance */}
      {(evidence.sourceName || evidence.sourceUrl) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
          {evidence.sourceName && (
            <span className="inline-flex items-center gap-1 font-medium text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded-sm">
              <Award className="w-3 h-3 text-brand-600" />
              Source: {evidence.sourceName}
            </span>
          )}

          {evidence.sourceUrl && (
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 hover:underline max-w-xs truncate"
              title={evidence.sourceUrl}
            >
              <Link className="w-3 h-3 shrink-0" />
              <span className="truncate">{evidence.sourceUrl}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            </a>
          )}
        </div>
      )}

      {/* Explainable Rationale Breakdown */}
      {rationale.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Explainable Heuristics
          </span>
          <ul className="space-y-1 text-xs text-slate-600">
            {rationale.map((r, rIdx) => (
              <li key={rIdx} className="flex items-start gap-1.5">
                <span className="text-slate-400 font-mono text-[11px]">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

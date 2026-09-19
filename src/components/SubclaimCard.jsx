import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  FileCheck2, 
  AlertCircle,
  HelpCircle,
  Hash,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { SUBCLAIM_STATUS, STATUS_CONFIG } from '../constants/statusTypes';
import EvidenceWorkspace from './EvidenceWorkspace';

export default function SubclaimCard({ 
  subclaim, 
  index, 
  onUpdateText, 
  onDeleteSubclaim, 
  onAddEvidence, 
  onDeleteEvidence 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(subclaim.text);

  const status = subclaim.status || SUBCLAIM_STATUS.MISSING;
  const score = subclaim.strengthScore || 0;
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG[SUBCLAIM_STATUS.MISSING];
  const evidenceCount = (subclaim.evidenceList || []).length;

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdateText(subclaim.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(subclaim.text);
    setIsEditing(false);
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
      status === SUBCLAIM_STATUS.CONTRADICTED ? 'border-rose-300 ring-1 ring-rose-100' :
      status === SUBCLAIM_STATUS.SUPPORTED ? 'border-emerald-300 ring-1 ring-emerald-50' :
      status === SUBCLAIM_STATUS.PARTIALLY_SUPPORTED ? 'border-amber-300 ring-1 ring-amber-50' :
      'border-slate-200'
    }`}>
      
      {/* Subclaim Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          
          {/* Index & Subclaim Statement */}
          <div className="flex items-start gap-3 flex-1">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {index + 1}
            </span>

            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 border border-brand-400 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-brand-200"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md"
                    title="Save edit"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"
                    title="Cancel edit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="group/title flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {subclaim.text}
                  </h3>
                  <button
                    onClick={() => {
                      setEditText(subclaim.text);
                      setIsEditing(true);
                    }}
                    className="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-opacity"
                    title="Edit subclaim statement"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Subclaim metadata tags */}
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {subclaim.type && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {subclaim.type} assertion
                  </span>
                )}
                {subclaim.targetMetric && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                    Target: {subclaim.targetMetric.value}{subclaim.targetMetric.type === 'percentage' ? '%' : ` ${subclaim.targetMetric.unit || ''}`}
                  </span>
                )}
                <span className="text-xs text-slate-600">
                  {evidenceCount} evidence item{evidenceCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center gap-2">
            {/* Status Pill */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeBg}`}>
              {status === SUBCLAIM_STATUS.SUPPORTED && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {status === SUBCLAIM_STATUS.PARTIALLY_SUPPORTED && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
              {status === SUBCLAIM_STATUS.CONTRADICTED && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
              {status === SUBCLAIM_STATUS.MISSING && <HelpCircle className="w-3.5 h-3.5 text-slate-400" />}
              <span>{statusInfo.label}</span>
            </span>

            {/* Delete subclaim */}
            <button
              onClick={() => onDeleteSubclaim(subclaim.id)}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete this subclaim"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Expand / Collapse toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title={isExpanded ? 'Collapse evidence' : 'Expand evidence'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strength Progress Meter & Assessment Rationale */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <span className="text-xs text-slate-600 flex items-center gap-1.5">
              <span className="font-semibold text-slate-800">Verdict Rationale:</span>
              <span className="italic">{subclaim.primaryRationale || 'No evidence evaluated yet.'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600">Subclaim Strength:</span>
            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 70 ? 'bg-emerald-500' :
                  score >= 40 ? 'bg-amber-500' :
                  score > 0 ? 'bg-rose-500' : 'bg-slate-300'
                }`}
                style={{ width: `${Math.max(score, 4)}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 w-9 text-right">
              {score}%
            </span>
          </div>
        </div>

      </div>

      {/* Expanded Evidence Workspace */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-4 sm:px-5 pb-5 bg-slate-50/30">
          <EvidenceWorkspace
            subclaim={subclaim}
            onAddEvidence={onAddEvidence}
            onDeleteEvidence={onDeleteEvidence}
          />
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Binary, 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  FileCheck2,
  Cpu
} from 'lucide-react';

export default function ExplainabilityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Transparent Assessment Model
              </h3>
              <p className="text-xs text-slate-500">
                100% Explainable • Local Heuristics • Zero Black-Box Hallucination
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* Philosophy banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100">
            <h4 className="font-bold text-brand-950 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-brand-600" />
              Explainability Over Blind Confidence
            </h4>
            <p className="text-xs text-slate-600">
              ProofPath AI does not rely on opaque third-party AI models that output unsupported opinions. Instead, every evaluation is computed using deterministic token intersection, quantitative delta evaluation, and negation parsing.
            </p>
          </div>

          {/* Subclaim Classification Rules */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              1. Subclaim Relationship Classification
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  SUPPORTED (Score: 65 - 100)
                </span>
                <p className="text-[11px] text-slate-600">
                  Vocabulary overlap ≥ 55% or exact quantitative metric match without negation cues.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
                <span className="font-bold text-amber-800 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  PARTIAL SUPPORT (Score: 30 - 64)
                </span>
                <p className="text-[11px] text-slate-600">
                  Vocabulary overlap 25%–54% or relevant context without complete metric confirmation.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                <span className="font-bold text-rose-800 flex items-center gap-1.5 text-xs">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  CONTRADICTED (Score: 10 - 25)
                </span>
                <p className="text-[11px] text-slate-600">
                  Opposing metric detected (e.g. 80% vs 45%) or explicit negation terms applied to claim keywords.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  MISSING EVIDENCE (Score: 0)
                </span>
                <p className="text-[11px] text-slate-600">
                  No evidence provided or token overlap is below the 20% relevance threshold.
                </p>
              </div>
            </div>
          </div>

          {/* Scoring Formula */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              2. Deterministic Scoring Weights
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Lexical Alignment:</span>
                <span className="font-bold text-slate-900">55 + (Overlap Ratio × 30) pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Affirmative Audit Terms:</span>
                <span className="font-bold text-emerald-600">+10 pts bonus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Verified Source URL:</span>
                <span className="font-bold text-brand-600">+8 pts provenance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Named Issuing Organization:</span>
                <span className="font-bold text-brand-600">+7 pts provenance</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1">
                <span className="text-slate-600">Metric Conflict / Negation Penalty:</span>
                <span className="font-bold text-rose-600">Caps score at ≤ 25 pts</span>
              </div>
            </div>
          </div>

          {/* Overall Status Aggregation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              3. Overall Status Aggregation
            </h4>
            <p className="text-xs text-slate-600">
              The overarching verdict synthesizes subclaim scores and flags critical discrepancies:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li><strong>Conflicting Evidence:</strong> Triggered whenever any subclaim is actively contradicted.</li>
              <li><strong>Well Supported:</strong> Coverage ≥ 75% and composite strength ≥ 70%.</li>
              <li><strong>Partially Supported:</strong> Coverage ≥ 40% with supporting evidence.</li>
              <li><strong>Insufficient Evidence:</strong> Subclaims lack verifiable records.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}

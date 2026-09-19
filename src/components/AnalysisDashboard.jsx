import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  CheckCircle2, 
  Percent, 
  Activity, 
  FileText,
  Info,
  Scale
} from 'lucide-react';
import { OVERALL_STATUS, OVERALL_STATUS_CONFIG } from '../constants/statusTypes';

export default function AnalysisDashboard({ analysisResult, onOpenExplainabilityModal }) {
  if (!analysisResult) return null;

  const {
    coveragePercent,
    evidenceStrength,
    counts,
    overallStatus,
    explanation,
    subclaimResults
  } = analysisResult;

  const statusConfig = OVERALL_STATUS_CONFIG[overallStatus] || OVERALL_STATUS_CONFIG[OVERALL_STATUS.INSUFFICIENT_EVIDENCE];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            3
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Overall Evidence Assessment
          </h2>
        </div>

        <button
          onClick={onOpenExplainabilityModal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Explain Scoring Model</span>
        </button>
      </div>

      {/* Primary Verdict Banner */}
      <div className={`rounded-2xl border-2 p-5 sm:p-6 transition-all ${statusConfig.borderClass} ${statusConfig.bgLight}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wide border shadow-2xs ${statusConfig.badgeBg}`}>
                {overallStatus === OVERALL_STATUS.WELL_SUPPORTED && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                {overallStatus === OVERALL_STATUS.PARTIALLY_SUPPORTED && <AlertTriangle className="w-4 h-4 text-amber-700" />}
                {overallStatus === OVERALL_STATUS.CONFLICTING_EVIDENCE && <XCircle className="w-4 h-4 text-rose-700" />}
                {overallStatus === OVERALL_STATUS.INSUFFICIENT_EVIDENCE && <HelpCircle className="w-4 h-4 text-slate-600" />}
                <span>{statusConfig.label}</span>
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                Explainable Verdict
              </span>
            </div>

            <p className={`text-sm sm:text-base font-semibold leading-relaxed ${statusConfig.summaryClass}`}>
              {explanation}
            </p>
          </div>

          {/* Quick Composite Rating Gauge */}
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-slate-200/80 shadow-2xs shrink-0 self-start md:self-auto">
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Evidence Score
              </span>
              <span className="text-3xl font-black text-slate-900 font-mono">
                {evidenceStrength}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Coverage
              </span>
              <span className="text-3xl font-black text-brand-600 font-mono">
                {coveragePercent}
                <span className="text-sm font-normal text-brand-400">%</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Metrics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Supported Card */}
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Supported</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-950 font-mono">
              {counts.supported}
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {counts.total > 0 ? Math.round((counts.supported / counts.total) * 100) : 0}% of claims
            </span>
          </div>
        </div>

        {/* Partially Supported Card */}
        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Partial</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-950 font-mono">
              {counts.partial}
            </span>
            <span className="text-xs font-medium text-amber-700">
              {counts.total > 0 ? Math.round((counts.partial / counts.total) * 100) : 0}% of claims
            </span>
          </div>
        </div>

        {/* Contradicted Card */}
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Contradicted</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-950 font-mono">
              {counts.contradicted}
            </span>
            <span className="text-xs font-medium text-rose-700">
              {counts.total > 0 ? Math.round((counts.contradicted / counts.total) * 100) : 0}% of claims
            </span>
          </div>
        </div>

        {/* Missing Evidence Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Missing</span>
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {counts.missing}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {counts.total > 0 ? Math.round((counts.missing / counts.total) * 100) : 0}% of claims
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}

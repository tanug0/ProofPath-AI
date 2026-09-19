import React, { useState } from 'react';
import { 
  Network, 
  GitFork, 
  FileCheck, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  HelpCircle,
  Layers,
  Sparkles,
  Link,
  ChevronRight,
  Filter,
  Eye,
  Maximize2
} from 'lucide-react';
import { SUBCLAIM_STATUS, STATUS_CONFIG, OVERALL_STATUS, OVERALL_STATUS_CONFIG } from '../constants/statusTypes';

export default function EvidenceGraph({ analysisResult }) {
  if (!analysisResult) return null;

  const {
    mainClaim,
    subclaimResults = [],
    overallStatus,
    evidenceStrength,
    coveragePercent
  } = analysisResult;

  const [selectedSubclaimId, setSelectedSubclaimId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const overallConfig = OVERALL_STATUS_CONFIG[overallStatus] || OVERALL_STATUS_CONFIG[OVERALL_STATUS.INSUFFICIENT_EVIDENCE];

  const filteredSubclaims = subclaimResults.filter(sc => {
    if (filterStatus === 'ALL') return true;
    return sc.status === filterStatus;
  });

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6 overflow-hidden">
      
      {/* Graph Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
            4
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Interactive Evidence Graph</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Live Data Flow
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizes the logical path: Main Claim → Subclaims → Evidence Items → Verification Verdict
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2 py-1 rounded-md transition-colors ${filterStatus === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({subclaimResults.length})
            </button>
            <button
              onClick={() => setFilterStatus(SUBCLAIM_STATUS.SUPPORTED)}
              className={`px-2 py-1 rounded-md transition-colors ${filterStatus === SUBCLAIM_STATUS.SUPPORTED ? 'bg-emerald-500 text-white font-bold' : 'text-slate-600 hover:text-emerald-700'}`}
            >
              Supported
            </button>
            <button
              onClick={() => setFilterStatus(SUBCLAIM_STATUS.PARTIALLY_SUPPORTED)}
              className={`px-2 py-1 rounded-md transition-colors ${filterStatus === SUBCLAIM_STATUS.PARTIALLY_SUPPORTED ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-amber-700'}`}
            >
              Partial
            </button>
            <button
              onClick={() => setFilterStatus(SUBCLAIM_STATUS.CONTRADICTED)}
              className={`px-2 py-1 rounded-md transition-colors ${filterStatus === SUBCLAIM_STATUS.CONTRADICTED ? 'bg-rose-500 text-white font-bold' : 'text-slate-600 hover:text-rose-700'}`}
            >
              Contradicted
            </button>
          </div>

          {selectedSubclaimId && (
            <button
              onClick={() => setSelectedSubclaimId(null)}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
            >
              Clear Focus
            </button>
          )}
        </div>
      </div>

      {/* Visual Graph Workspace Canvas */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-8 relative overflow-x-auto">
        <div className="min-w-[650px] flex flex-col items-center space-y-8">
          
          {/* LEVEL 1: MAIN CLAIM (Root Node) */}
          <div className="w-full max-w-xl text-center">
            <div className="inline-block relative">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white p-5 rounded-2xl shadow-md border border-slate-700 transition-all hover:scale-[1.01]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-brand-200 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-brand-400" />
                    Level 1: Main Claim
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Target Assertion
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white text-left leading-relaxed">
                  "{mainClaim}"
                </p>
              </div>

              {/* Downward Connector Arrow */}
              <div className="flex flex-col items-center justify-center -mb-2 mt-2">
                <div className="w-0.5 h-6 bg-slate-300" />
                <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 -mt-1" />
              </div>
            </div>
          </div>

          {/* LEVEL 2: SUBCLAIMS & LEVEL 3: EVIDENCE COLUMNS */}
          <div className="w-full space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                Level 2 & 3: Subclaims Decomposition & Evidence Tracing
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSubclaims.map((subclaim, scIdx) => {
                const scStatus = subclaim.status;
                const scInfo = STATUS_CONFIG[scStatus] || STATUS_CONFIG[SUBCLAIM_STATUS.MISSING];
                const isSelected = selectedSubclaimId === subclaim.id;
                const evidenceList = subclaim.evidenceList || [];

                return (
                  <div
                    key={subclaim.id}
                    onClick={() => setSelectedSubclaimId(isSelected ? null : subclaim.id)}
                    className={`flex flex-col rounded-2xl bg-white border-2 transition-all cursor-pointer p-4 space-y-3 ${
                      isSelected 
                        ? 'ring-2 ring-brand-500 border-brand-500 shadow-md scale-[1.01]' 
                        : `${scInfo.cardBorder} shadow-2xs hover:shadow-xs`
                    }`}
                  >
                    {/* Subclaim Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold font-mono flex items-center justify-center">
                          {scIdx + 1}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${scInfo.badgeBg}`}>
                          {scInfo.label}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">
                        {subclaim.strengthScore}%
                      </span>
                    </div>

                    {/* Subclaim Text */}
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {subclaim.text}
                    </p>

                    {/* Connector line down to Evidence */}
                    <div className="flex items-center justify-center my-1">
                      <div className="w-full h-px bg-slate-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] font-semibold text-slate-400">
                          EVIDENCE PATH
                        </div>
                      </div>
                    </div>

                    {/* Evidence Nodes Attached */}
                    <div className="space-y-2 flex-1">
                      {evidenceList.length > 0 ? (
                        evidenceList.map((ev, evIdx) => {
                          const evalObj = subclaim.evaluations?.find(e => e.evidence.id === ev.id)?.evaluation;
                          const evStatus = evalObj?.status || scStatus;
                          const evInfo = STATUS_CONFIG[evStatus] || STATUS_CONFIG[SUBCLAIM_STATUS.MISSING];

                          return (
                            <div 
                              key={ev.id || evIdx}
                              className={`text-xs p-2.5 rounded-xl border ${evInfo.badgeBg} bg-white space-y-1`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                                <span className="flex items-center gap-1">
                                  <FileCheck className="w-3 h-3 text-brand-600" />
                                  Evidence #{evIdx + 1}
                                </span>
                                <span className="font-mono">{evalObj?.score || 0} pts</span>
                              </div>
                              <p className="text-slate-800 line-clamp-3 italic">
                                "{ev.text}"
                              </p>
                              {ev.sourceName && (
                                <span className="text-[10px] text-slate-500 font-medium block truncate">
                                  Source: {ev.sourceName}
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                          <HelpCircle className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                          <span className="text-[11px] text-slate-400 font-medium">
                            No evidence provided
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Subclaim Rationale Tooltip / Footnote */}
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-tight">
                      <span className="font-semibold text-slate-700">Audit note: </span>
                      {subclaim.primaryRationale}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* LEVEL 4: OVERALL VERDICT (Target Node) */}
          <div className="w-full max-w-xl text-center pt-2">
            
            {/* Downward Connector Arrow */}
            <div className="flex flex-col items-center justify-center -mt-4 mb-3">
              <div className="w-0.5 h-6 bg-slate-300" />
              <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 -mt-1" />
            </div>

            <div className={`p-5 rounded-2xl border-2 shadow-sm ${overallConfig.borderClass} ${overallConfig.bgLight} transition-all`}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white font-bold text-slate-700 flex items-center gap-1 border border-slate-200">
                  <CheckCircle2 className="w-3 h-3 text-brand-600" />
                  Level 4: Synthesis & Final Verdict
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Score: {evidenceStrength}/100 • Coverage: {coveragePercent}%
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`px-3.5 py-1.5 rounded-full text-sm font-black border ${overallConfig.badgeBg}`}>
                  {overallConfig.label}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {analysisResult.explanation}
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

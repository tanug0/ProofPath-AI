import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Download, 
  ExternalLink,
  ChevronDown,
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../services/demoData';
import { exportAnalysisAsJSON, exportAnalysisAsMarkdown } from '../services/exportUtils';

export default function Header({ 
  onLoadDemo, 
  onReset, 
  analysisResult, 
  onOpenExplainabilityModal 
}) {
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-brand-700 bg-clip-text text-transparent">
                  ProofPath<span className="text-brand-600 font-black ml-0.5">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  <Zap className="w-3 h-3 mr-1 text-brand-500 fill-brand-500" /> Hackathon MVP
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium hidden md:block">
                Turn claims into verifiable evidence.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Demo Scenario Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDemoMenu(!showDemoMenu);
                  setShowExportMenu(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 text-sm font-semibold rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800 border border-brand-200 transition-all shadow-xs"
                title="Load preconfigured demo claim and evidence"
              >
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Try Demo</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoMenu ? 'rotate-180' : ''}`} />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Select Demo Scenario
                    </span>
                  </div>
                  {DEMO_SCENARIOS.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        onLoadDemo(demo);
                        setShowDemoMenu(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors flex flex-col gap-0.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-600">
                          {demo.title}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {demo.tag}
                        </span>
                      </div>
                      <span className="text-xs text-slate-700 line-clamp-1 italic">
                        "{demo.claim}"
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Explain Engine Button */}
            <button
              onClick={onOpenExplainabilityModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="How ProofPath evaluates claims transparently"
            >
              <Info className="w-4 h-4 text-slate-600" />
              <span>How It Works</span>
            </button>

            {/* Export Menu if result exists */}
            {analysisResult && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowExportMenu(!showExportMenu);
                    setShowDemoMenu(false);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                  title="Export audit report"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50">
                    <button
                      onClick={() => {
                        exportAnalysisAsMarkdown(analysisResult);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      Export Markdown Report
                    </button>
                    <button
                      onClick={() => {
                        exportAnalysisAsJSON(analysisResult);
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-brand-600" />
                      Export Audit JSON
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reset / New Claim Button */}
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2 text-sm font-medium rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              title="Clear all and start fresh"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">New Claim</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}

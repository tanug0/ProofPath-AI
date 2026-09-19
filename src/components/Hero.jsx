import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  GitFork, 
  FileSearch, 
  CheckCircle2, 
  Network
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../services/demoData';

export default function Hero({ onStartVerification, onLoadDemo }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-200/60 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-52 bg-gradient-to-tr from-brand-200/40 via-purple-100/30 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Value badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Explainable Local Evidence Verification</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
          Turn claims into{' '}
          <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 bg-clip-text text-transparent underline decoration-brand-200 decoration-wavy decoration-2">
            verifiable evidence.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          ProofPath AI deconstructs statements into atomic subclaims, cross-evaluates your evidence with transparent heuristics, and visualizes the exact reasoning path from source to verdict.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={onStartVerification}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Verify a Claim</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onLoadDemo(DEMO_SCENARIOS[0])}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-all hover:border-slate-400"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Try 60s Demo</span>
          </button>
        </div>

        {/* Quick Demo Previews */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-500 mb-8">
          <span className="font-semibold text-slate-600">Quick Scenarios:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => onLoadDemo(scenario)}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 font-medium text-slate-600 transition-colors shadow-2xs"
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Steps Visual Flow Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 text-left">
          
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">1. Claim Input</span>
              <span className="text-[11px] text-slate-500">State any product, tech, or medical claim.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <GitFork className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">2. Deconstruct</span>
              <span className="text-[11px] text-slate-500">Breaks into atomic verifiable subclaims.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">3. Add Evidence</span>
              <span className="text-[11px] text-slate-500">Provide quotes, audits, and source URLs.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">4. Proof Graph</span>
              <span className="text-[11px] text-slate-500">Explainable score & visual evidence path.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

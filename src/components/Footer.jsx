import React from 'react';
import { ShieldCheck, Cpu, Code2 } from 'lucide-react';

export default function Footer({ onOpenExplainabilityModal }) {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-10 mt-16 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">
              ProofPath AI
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              Turn claims into verifiable evidence.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenExplainabilityModal}
              className="text-slate-600 hover:text-brand-600 transition-colors cursor-pointer"
            >
              Scoring Model
            </button>
            <span>•</span>
            <span className="text-slate-600">Client-Side Architecture</span>
            <span>•</span>
            <span className="text-slate-600">Zero External APIs Required</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <p>
            Built for the 24-Hour Hackathon. ProofPath AI provides explainable evidence evaluation and does not claim absolute omniscience.
          </p>
          <p className="font-mono">
            React + Vite + Tailwind CSS
          </p>
        </div>

      </div>
    </footer>
  );
}

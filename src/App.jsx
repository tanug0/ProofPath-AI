import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ClaimInput from './components/ClaimInput';
import SubclaimList from './components/SubclaimList';
import AnalysisDashboard from './components/AnalysisDashboard';
import EvidenceGraph from './components/EvidenceGraph';
import ExplainabilityModal from './components/ExplainabilityModal';
import Footer from './components/Footer';

import { decomposeClaim } from './services/claimDecomposer';
import { analyzeClaimVerification } from './services/evidenceAnalyzer';
import { DEMO_SCENARIOS } from './services/demoData';

export default function App() {
  const [claimText, setClaimText] = useState('');
  const [subclaims, setSubclaims] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  // Recalculate analysis result whenever claimText or subclaims change
  useEffect(() => {
    if (claimText.trim() && subclaims.length > 0) {
      const result = analyzeClaimVerification(claimText, subclaims);
      setAnalysisResult(result);
    } else {
      setAnalysisResult(null);
    }
  }, [claimText, subclaims]);

  // Handler: Analyze / Deconstruct Claim
  const handleAnalyzeClaim = () => {
    if (!claimText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const decomposed = decomposeClaim(claimText);
      setSubclaims(decomposed);
      setIsAnalyzing(false);

      // Scroll smoothly to subclaims section
      setTimeout(() => {
        const target = document.getElementById('subclaims-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 250);
  };

  // Handler: Load Demo Scenario
  const handleLoadDemo = (scenario) => {
    const selected = scenario || DEMO_SCENARIOS[0];
    setClaimText(selected.claim);
    setSubclaims(selected.subclaims);

    setTimeout(() => {
      const target = document.getElementById('analysis-results-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Handler: Reset / Start Fresh
  const handleReset = () => {
    setClaimText('');
    setSubclaims([]);
    setAnalysisResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Update Subclaim Text
  const handleUpdateSubclaimText = (subclaimId, newText) => {
    setSubclaims(prev => prev.map(sc => {
      if (sc.id === subclaimId) {
        return { ...sc, text: newText };
      }
      return sc;
    }));
  };

  // Handler: Delete a Subclaim
  const handleDeleteSubclaim = (subclaimId) => {
    setSubclaims(prev => prev.filter(sc => sc.id !== subclaimId));
  };

  // Handler: Add Custom Subclaim
  const handleAddSubclaim = (customText) => {
    const newSc = {
      id: 'sc_' + Math.random().toString(36).substring(2, 9),
      text: customText,
      type: 'custom',
      keywords: customText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2),
      evidenceList: []
    };
    setSubclaims(prev => [...prev, newSc]);
  };

  // Handler: Add Evidence to Subclaim
  const handleAddEvidence = (subclaimId, evidenceData) => {
    const newEvidence = {
      id: 'ev_' + Math.random().toString(36).substring(2, 9),
      ...evidenceData
    };

    setSubclaims(prev => prev.map(sc => {
      if (sc.id === subclaimId) {
        return {
          ...sc,
          evidenceList: [...(sc.evidenceList || []), newEvidence]
        };
      }
      return sc;
    }));
  };

  // Handler: Delete Evidence from Subclaim
  const handleDeleteEvidence = (subclaimId, evidenceId) => {
    setSubclaims(prev => prev.map(sc => {
      if (sc.id === subclaimId) {
        return {
          ...sc,
          evidenceList: (sc.evidenceList || []).filter(ev => ev.id !== evidenceId)
        };
      }
      return sc;
    }));
  };

  // Scroll to claim input
  const handleStartVerification = () => {
    const target = document.getElementById('claim-input-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const textarea = target.querySelector('textarea');
      if (textarea) textarea.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Header
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
        analysisResult={analysisResult}
        onOpenExplainabilityModal={() => setIsExplainModalOpen(true)}
      />

      {/* Hero Landing Section */}
      <Hero
        onStartVerification={handleStartVerification}
        onLoadDemo={handleLoadDemo}
      />

      {/* Main Interactive Flow */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1 w-full">
        
        {/* Step 1: Claim Input */}
        <ClaimInput
          claimText={claimText}
          setClaimText={setClaimText}
          onAnalyze={handleAnalyzeClaim}
          isAnalyzing={isAnalyzing}
          hasSubclaims={subclaims.length > 0}
        />

        {/* Step 2: Subclaims & Evidence Workspace */}
        {subclaims.length > 0 && (
          <div id="subclaims-section" className="scroll-mt-24 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <SubclaimList
              subclaims={analysisResult?.subclaimResults || subclaims}
              onUpdateSubclaimText={handleUpdateSubclaimText}
              onDeleteSubclaim={handleDeleteSubclaim}
              onAddSubclaim={handleAddSubclaim}
              onAddEvidence={handleAddEvidence}
              onDeleteEvidence={handleDeleteEvidence}
            />

            {/* Step 3: Overall Analysis Dashboard */}
            {analysisResult && (
              <div id="analysis-results-section" className="scroll-mt-24 space-y-10">
                <AnalysisDashboard
                  analysisResult={analysisResult}
                  onOpenExplainabilityModal={() => setIsExplainModalOpen(true)}
                />

                {/* Step 4: Interactive Evidence Graph */}
                <EvidenceGraph
                  analysisResult={analysisResult}
                />
              </div>
            )}
          </div>
        )}

      </main>

      {/* Explainability Engine Inspection Modal */}
      <ExplainabilityModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenExplainabilityModal={() => setIsExplainModalOpen(true)}
      />

    </div>
  );
}

import React, { useState } from 'react';
import { 
  GitFork, 
  Plus, 
  Sparkles, 
  HelpCircle,
  Layers,
  AlertCircle
} from 'lucide-react';
import SubclaimCard from './SubclaimCard';

export default function SubclaimList({ 
  subclaims, 
  onUpdateSubclaimText, 
  onDeleteSubclaim, 
  onAddSubclaim, 
  onAddEvidence, 
  onDeleteEvidence 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubclaimText, setNewSubclaimText] = useState('');
  const [error, setError] = useState('');

  const handleAddCustom = (e) => {
    e?.preventDefault();
    if (!newSubclaimText.trim()) {
      setError('Please enter subclaim text.');
      return;
    }
    onAddSubclaim(newSubclaimText.trim());
    setNewSubclaimText('');
    setError('');
    setShowAddModal(false);
  };

  return (
    <section className="space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
            2
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Decomposed Subclaims & Evidence Workspace</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                {subclaims.length} components
              </span>
            </h2>
          </div>
        </div>

        {/* Add Custom Subclaim Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Subclaim</span>
        </button>
      </div>

      {/* Add Custom Subclaim Form Modal / inline */}
      {showAddModal && (
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 animate-in fade-in duration-150">
          <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            Add Custom Subclaim
          </h4>
          <form onSubmit={handleAddCustom} className="space-y-3">
            <input
              type="text"
              value={newSubclaimText}
              onChange={(e) => {
                setNewSubclaimText(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. The product packaging is certified compostable under ASTM D6400."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-indigo-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            {error && (
              <div className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setError('');
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/60 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
              >
                Create Subclaim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subclaims List */}
      <div className="space-y-4">
        {subclaims.map((subclaim, idx) => (
          <SubclaimCard
            key={subclaim.id}
            subclaim={subclaim}
            index={idx}
            onUpdateText={onUpdateSubclaimText}
            onDeleteSubclaim={onDeleteSubclaim}
            onAddEvidence={onAddEvidence}
            onDeleteEvidence={onDeleteEvidence}
          />
        ))}
      </div>

    </section>
  );
}

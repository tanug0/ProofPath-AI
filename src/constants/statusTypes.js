export const SUBCLAIM_STATUS = {
  SUPPORTED: 'SUPPORTED',
  PARTIALLY_SUPPORTED: 'PARTIALLY SUPPORTED',
  CONTRADICTED: 'CONTRADICTED',
  MISSING: 'MISSING',
};

export const OVERALL_STATUS = {
  WELL_SUPPORTED: 'WELL SUPPORTED',
  PARTIALLY_SUPPORTED: 'PARTIALLY SUPPORTED',
  INSUFFICIENT_EVIDENCE: 'INSUFFICIENT EVIDENCE',
  CONFLICTING_EVIDENCE: 'CONFLICTING EVIDENCE',
};

export const STATUS_CONFIG = {
  [SUBCLAIM_STATUS.SUPPORTED]: {
    label: 'Supported',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotBg: 'bg-emerald-500',
    cardBorder: 'border-emerald-200 hover:border-emerald-300',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    description: 'Evidence strongly validates the core entities and assertions in this subclaim.',
  },
  [SUBCLAIM_STATUS.PARTIALLY_SUPPORTED]: {
    label: 'Partially Supported',
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    dotBg: 'bg-amber-500',
    cardBorder: 'border-amber-200 hover:border-amber-300',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    description: 'Evidence provides related context, but lacks complete metric matching or full assertion coverage.',
  },
  [SUBCLAIM_STATUS.CONTRADICTED]: {
    label: 'Contradicted',
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    dotBg: 'bg-rose-500',
    cardBorder: 'border-rose-200 hover:border-rose-300',
    glowColor: 'rgba(239, 68, 68, 0.2)',
    description: 'Evidence directly disputes, disproves, or introduces conflicting figures against this subclaim.',
  },
  [SUBCLAIM_STATUS.MISSING]: {
    label: 'Missing Evidence',
    color: 'slate',
    badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
    dotBg: 'bg-slate-400',
    cardBorder: 'border-slate-200 hover:border-slate-300',
    glowColor: 'rgba(100, 116, 139, 0.1)',
    description: 'No verifiable evidence documents or text snippets have been attached for this subclaim.',
  },
};

export const OVERALL_STATUS_CONFIG = {
  [OVERALL_STATUS.WELL_SUPPORTED]: {
    label: 'Well Supported',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderClass: 'border-emerald-500',
    bgLight: 'bg-emerald-50/70',
    iconColor: 'text-emerald-600',
    summaryClass: 'text-emerald-950',
    description: 'The vast majority of subclaims are backed by high-confidence supporting evidence with no severe contradictions.',
  },
  [OVERALL_STATUS.PARTIALLY_SUPPORTED]: {
    label: 'Partially Supported',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    borderClass: 'border-amber-500',
    bgLight: 'bg-amber-50/70',
    iconColor: 'text-amber-600',
    summaryClass: 'text-amber-950',
    description: 'Certain subclaims have verified backing, but some components remain unproven or only partially addressed.',
  },
  [OVERALL_STATUS.INSUFFICIENT_EVIDENCE]: {
    label: 'Insufficient Evidence',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    borderClass: 'border-slate-400',
    bgLight: 'bg-slate-50/80',
    iconColor: 'text-slate-600',
    summaryClass: 'text-slate-900',
    description: 'Key assertions have little to no evidence provided. Further documentation is required before reaching a verdict.',
  },
  [OVERALL_STATUS.CONFLICTING_EVIDENCE]: {
    label: 'Conflicting Evidence',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    borderClass: 'border-rose-500',
    bgLight: 'bg-rose-50/70',
    iconColor: 'text-rose-600',
    summaryClass: 'text-rose-950',
    description: 'One or more subclaims are actively contradicted by the submitted evidence records, indicating factual discrepancy.',
  },
};

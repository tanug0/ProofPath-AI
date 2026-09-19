/**
 * ProofPath AI - Transparent Evidence Assessment Engine
 * 
 * Analyzes relationships between Subclaims and Evidence records using
 * explainable heuristics:
 * 1. Semantic Token, Stem & N-Gram overlap
 * 2. Quantitative / Metric Verification (exact match, threshold check, vs discrepancy)
 * 3. Negation & Conflict Detection (contradiction cues, opposite figures)
 * 4. Source Credibility heuristic (presence of verified source / URL)
 * 5. Deterministic scoring (0-100) with line-item rationale
 */

import { SUBCLAIM_STATUS, OVERALL_STATUS } from '../constants/statusTypes.js';

// Negation cues indicating denial, failure, or absence
const NEGATION_PATTERNS = [
  /\b(not|never|no|none|neither|nor)\b/i,
  /\b(fails|failed|failing|lacks|lacking|without)\b/i,
  /\b(doesn't|does not|cannot|can't|won't|will not|is not|isn't|was not|wasn't|aren't|are not)\b/i,
  /\b(disproven|untrue|false|refutes|refuted|contradicts|contradicted|opposite|zero|0%)\b/i,
  /\b(non-recyclable|non-compliant|ineligible|unverified|debunked|unsubstantiated)\b/i
];

// Supporting affirmative cues
const AFFIRMATIVE_PATTERNS = [
  /\b(confirms|confirmed|verifies|verified|proves|proven|demonstrates|demonstrated|audit|certified|certification)\b/i,
  /\b(shows|showed|documented|accredited|guaranteed|substantiated|passed|compliant|benchmarked)\b/i,
  /\b(measured|tested|valid|established|reported|recorded|authenticated|validates)\b/i
];

// Threshold comparator patterns (e.g. "under 3 hours", "at least 90%")
const THRESHOLD_LESS_PATTERNS = /\b(under|less than|below|within|sub-|max|maximum of|up to)\b/i;
const THRESHOLD_MORE_PATTERNS = /\b(at least|over|more than|above|exceeds|exceeding|minimum of)\b/i;

// Basic stemmer approximations (e.g. "materials" -> "materi", "recycled" -> "recycl")
function getStem(word) {
  if (!word || word.length <= 3) return word;
  return word
    .toLowerCase()
    .replace(/(?:ing|ies|es|s|ed|able|ible|tion|tions|al|ity)$/i, '');
}

/**
 * Tokenize string into meaningful lowercase terms (excluding stop words)
 */
function tokenize(text) {
  if (!text) return [];
  const rawWords = text
    .toLowerCase()
    .replace(/[^\w\s%]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'about', 'from', 'this', 'that', 'these', 'those',
    'which', 'where', 'when', 'who', 'what', 'why', 'how', 'has', 'have', 'had',
    'been', 'being', 'were', 'was', 'are', 'its', 'their', 'our', 'your', 'his', 'her'
  ]);

  return rawWords.filter(w => !stopWords.has(w));
}

/**
 * Extract numbers, percentages, and units
 */
function extractMetrics(text) {
  if (!text) return [];
  const metrics = [];
  
  // Percentages: e.g. 80%, 45.5%
  const percentMatches = text.matchAll(/(\d+(?:\.\d+)?)\s*%/g);
  for (const match of percentMatches) {
    metrics.push({ type: 'percentage', raw: match[0], value: parseFloat(match[1]) });
  }

  // Pure numbers with units or isolated numbers
  const numMatches = text.matchAll(/\b(\d+(?:\.\d+)?)\s*(kwh|hours?|hrs?|days?|years?|mg|g|kg|ml|l|km|miles?|percent|mins?|minutes?|patients?)\b/gi);
  for (const match of numMatches) {
    if (!match[0].includes('%')) {
      metrics.push({
        type: match[2] ? 'unit_metric' : 'number',
        raw: match[0],
        value: parseFloat(match[1]),
        unit: match[2] ? match[2].toLowerCase().replace(/s$/, '') : ''
      });
    }
  }

  return metrics;
}

/**
 * Evaluates a single evidence item against a target subclaim
 * @param {object} subclaim 
 * @param {object} evidence 
 * @returns {object} Analysis result with status, score, matches, and rationale
 */
export function evaluateEvidenceItem(subclaim, evidence) {
  const subclaimText = subclaim.text || '';
  const evidenceText = evidence.text || '';

  if (!evidenceText.trim()) {
    return {
      status: SUBCLAIM_STATUS.MISSING,
      score: 0,
      matchedKeywords: [],
      rationale: ['No evidence text provided.'],
      hasSourceUrl: Boolean(evidence.sourceUrl),
      hasSourceName: Boolean(evidence.sourceName),
    };
  }

  const subclaimTokens = tokenize(subclaimText);
  const evidenceTokens = tokenize(evidenceText);
  const subclaimMetrics = extractMetrics(subclaimText);
  const evidenceMetrics = extractMetrics(evidenceText);

  const rationale = [];
  let score = 0;

  // 1. Keyword / Token Overlap (with stemming)
  const matchedTokens = [];
  subclaimTokens.forEach(sToken => {
    const sStem = getStem(sToken);
    const matched = evidenceTokens.some(eToken => {
      const eStem = getStem(eToken);
      return (
        sToken === eToken ||
        (sStem.length >= 3 && eStem === sStem) ||
        (sToken.length >= 4 && eToken.includes(sToken)) ||
        (eToken.length >= 4 && sToken.includes(eToken))
      );
    });

    if (matched && !matchedTokens.includes(sToken)) {
      matchedTokens.push(sToken);
    }
  });

  const overlapRatio = subclaimTokens.length > 0 
    ? (matchedTokens.length / subclaimTokens.length) 
    : 0;

  // 2. Affirmative vs Negation check
  const hasAffirmative = AFFIRMATIVE_PATTERNS.some(pat => pat.test(evidenceText));
  const hasNegation = NEGATION_PATTERNS.some(pat => pat.test(evidenceText));

  // 3. Metric Comparison & Threshold Evaluation
  let metricMatchFound = false;
  let metricDiscrepancyFound = false;
  let metricDetails = null;

  const isUnderClaim = THRESHOLD_LESS_PATTERNS.test(subclaimText);
  const isOverClaim = THRESHOLD_MORE_PATTERNS.test(subclaimText);

  if (subclaimMetrics.length > 0 && evidenceMetrics.length > 0) {
    const subMetric = subclaimMetrics[0];
    
    // Check if there is an exact or compatible metric
    const matchingMetric = evidenceMetrics.find(em => {
      const sameType = (em.type === subMetric.type) || (em.unit && subMetric.unit && em.unit === subMetric.unit);
      if (!sameType) return false;

      // Check inequality threshold if applicable
      if (isUnderClaim && em.value <= subMetric.value) {
        return true; // e.g. "under 3 hours" and evidence is "2 hours" or "2.7 hours"
      }
      if (isOverClaim && em.value >= subMetric.value) {
        return true; // e.g. "at least 90%" and evidence is "92%"
      }

      // Exact numerical equality
      return Math.abs(em.value - subMetric.value) < 0.01;
    });

    if (matchingMetric) {
      metricMatchFound = true;
      metricDetails = { expected: subMetric.raw, found: matchingMetric.raw, match: true };
      rationale.push(`Verified numeric metric match: ${matchingMetric.raw} satisfies assertion criteria.`);
    } else {
      // Find conflicting metric of same type/unit
      const conflictingMetric = evidenceMetrics.find(em => 
        (em.type === subMetric.type) || (em.unit && subMetric.unit && em.unit === subMetric.unit)
      );

      if (conflictingMetric) {
        metricDiscrepancyFound = true;
        metricDetails = { expected: subMetric.raw, found: conflictingMetric.raw, match: false };
        rationale.push(`Metric conflict detected: Evidence specifies "${conflictingMetric.raw}", whereas subclaim asserted "${subMetric.raw}".`);
      }
    }
  }

  // 4. Source Credibility Bonus
  let credibilityBonus = 0;
  if (evidence.sourceUrl && evidence.sourceUrl.trim().length > 5) {
    credibilityBonus += 8;
  }
  if (evidence.sourceName && evidence.sourceName.trim().length > 1) {
    credibilityBonus += 7;
  }

  // 5. Classification Logic
  let status = SUBCLAIM_STATUS.PARTIALLY_SUPPORTED;

  // Case A: Clear contradiction (opposing metric or active negation with high keyword overlap)
  if (metricDiscrepancyFound) {
    status = SUBCLAIM_STATUS.CONTRADICTED;
    score = Math.max(15, Math.round(25 - (metricDetails.expected !== metricDetails.found ? 10 : 0)));
    rationale.push(`Subclaim is contradicted due to numerical mismatch (${metricDetails.expected} vs ${metricDetails.found}).`);
  } else if (hasNegation && (overlapRatio >= 0.35 || matchedTokens.length >= 2)) {
    status = SUBCLAIM_STATUS.CONTRADICTED;
    score = 15;
    rationale.push('Contradictory/negation keywords detected in the evidence opposing the subclaim assertion.');
  } 
  // Case B: Strong Support
  else if (
    (overlapRatio >= 0.48) || 
    (metricMatchFound && overlapRatio >= 0.25) ||
    (hasAffirmative && (overlapRatio >= 0.38 || matchedTokens.length >= 2))
  ) {
    status = SUBCLAIM_STATUS.SUPPORTED;
    const baseScore = Math.min(85, Math.round(55 + (overlapRatio * 30)));
    score = Math.min(100, baseScore + (hasAffirmative ? 10 : 0) + credibilityBonus);
    
    rationale.push(`Strong vocabulary alignment (${Math.round(overlapRatio * 100)}% terms matched: [${matchedTokens.slice(0, 5).join(', ')}]).`);
    if (hasAffirmative) {
      rationale.push('Affirmative validation terminology (e.g. audit, verified, confirms) reinforces factual standing.');
    }
    if (credibilityBonus > 0) {
      rationale.push(`Credible provenance provided (+${credibilityBonus} pts for source reference).`);
    }
  } 
  // Case C: Partial Support
  else if (overlapRatio >= 0.20 || matchedTokens.length >= 1 || hasAffirmative) {
    status = SUBCLAIM_STATUS.PARTIALLY_SUPPORTED;
    score = Math.min(65, Math.round(30 + (overlapRatio * 25) + credibilityBonus));
    rationale.push(`Moderate lexical overlap (${Math.round(overlapRatio * 100)}%). Evidence is relevant to "${matchedTokens.join(', ')}", but does not completely substantiate all aspects.`);
    if (subclaimMetrics.length > 0 && !metricMatchFound && !metricDiscrepancyFound) {
      rationale.push(`Required metric "${subclaimMetrics[0].raw}" is neither confirmed nor refuted in this evidence snippet.`);
    }
  } 
  // Case D: Negligible / Unrelated
  else {
    status = SUBCLAIM_STATUS.MISSING;
    score = Math.max(5, Math.round(overlapRatio * 20));
    rationale.push('Evidence snippet does not contain sufficient matching entities or semantic overlap for this subclaim.');
  }

  return {
    status,
    score,
    overlapRatio: Math.round(overlapRatio * 100),
    matchedKeywords: matchedTokens,
    rationale,
    hasAffirmative,
    hasNegation,
    metricDetails,
    credibilityBonus
  };
}

/**
 * Aggregates all subclaims and their evidence items into an overall claim evaluation
 * @param {string} mainClaim 
 * @param {Array} subclaims 
 * @returns {object} Complete assessment report
 */
export function analyzeClaimVerification(mainClaim, subclaims = []) {
  if (!subclaims || subclaims.length === 0) {
    return {
      mainClaim,
      coveragePercent: 0,
      evidenceStrength: 0,
      subclaimResults: [],
      counts: {
        supported: 0,
        partial: 0,
        contradicted: 0,
        missing: 0,
        total: 0
      },
      overallStatus: OVERALL_STATUS.INSUFFICIENT_EVIDENCE,
      explanation: 'No subclaims available to assess.'
    };
  }

  const evaluatedSubclaims = subclaims.map(sc => {
    const evidenceItems = sc.evidenceList || [];

    if (evidenceItems.length === 0) {
      return {
        ...sc,
        status: SUBCLAIM_STATUS.MISSING,
        strengthScore: 0,
        evaluations: [],
        primaryRationale: 'No evidence records have been submitted for this subclaim.',
        hasEvidence: false
      };
    }

    // Evaluate each evidence item
    const evaluations = evidenceItems.map(ev => ({
      evidence: ev,
      evaluation: evaluateEvidenceItem(sc, ev)
    }));

    // Determine highest-ranking or critical status for this subclaim
    // Priority: If any evidence contradicts -> Contradicted
    // Else if any is Supported -> Supported (with max score)
    // Else if any is Partially Supported -> Partially Supported
    // Else Missing
    const hasContradiction = evaluations.some(e => e.evaluation.status === SUBCLAIM_STATUS.CONTRADICTED);
    const hasSupport = evaluations.some(e => e.evaluation.status === SUBCLAIM_STATUS.SUPPORTED);
    const hasPartial = evaluations.some(e => e.evaluation.status === SUBCLAIM_STATUS.PARTIALLY_SUPPORTED);

    let finalStatus = SUBCLAIM_STATUS.MISSING;
    let maxScore = 0;
    let primaryRationale = '';

    if (hasContradiction) {
      finalStatus = SUBCLAIM_STATUS.CONTRADICTED;
      const contradictionEval = evaluations.find(e => e.evaluation.status === SUBCLAIM_STATUS.CONTRADICTED);
      maxScore = contradictionEval.evaluation.score;
      primaryRationale = contradictionEval.evaluation.rationale.join(' ');
    } else if (hasSupport) {
      finalStatus = SUBCLAIM_STATUS.SUPPORTED;
      const best = evaluations.filter(e => e.evaluation.status === SUBCLAIM_STATUS.SUPPORTED)
        .sort((a, b) => b.evaluation.score - a.evaluation.score)[0];
      maxScore = best.evaluation.score;
      primaryRationale = best.evaluation.rationale.join(' ');
    } else if (hasPartial) {
      finalStatus = SUBCLAIM_STATUS.PARTIALLY_SUPPORTED;
      const best = evaluations.filter(e => e.evaluation.status === SUBCLAIM_STATUS.PARTIALLY_SUPPORTED)
        .sort((a, b) => b.evaluation.score - a.evaluation.score)[0];
      maxScore = best.evaluation.score;
      primaryRationale = best.evaluation.rationale.join(' ');
    } else {
      finalStatus = SUBCLAIM_STATUS.MISSING;
      maxScore = 0;
      primaryRationale = 'Submitted evidence items do not sufficiently align with this subclaim.';
    }

    return {
      ...sc,
      status: finalStatus,
      strengthScore: maxScore,
      evaluations,
      primaryRationale,
      hasEvidence: true
    };
  });

  // Calculate Subclaim Counts
  const counts = {
    supported: evaluatedSubclaims.filter(s => s.status === SUBCLAIM_STATUS.SUPPORTED).length,
    partial: evaluatedSubclaims.filter(s => s.status === SUBCLAIM_STATUS.PARTIALLY_SUPPORTED).length,
    contradicted: evaluatedSubclaims.filter(s => s.status === SUBCLAIM_STATUS.CONTRADICTED).length,
    missing: evaluatedSubclaims.filter(s => s.status === SUBCLAIM_STATUS.MISSING).length,
    total: evaluatedSubclaims.length
  };

  // Coverage %: Subclaims with non-missing status / total subclaims
  const activeEvaluated = evaluatedSubclaims.filter(s => s.status !== SUBCLAIM_STATUS.MISSING).length;
  const coveragePercent = counts.total > 0 ? Math.round((activeEvaluated / counts.total) * 100) : 0;

  // Average Evidence Strength (0-100)
  const totalScore = evaluatedSubclaims.reduce((acc, curr) => acc + curr.strengthScore, 0);
  const evidenceStrength = counts.total > 0 ? Math.round(totalScore / counts.total) : 0;

  // Determine Overall Status
  let overallStatus = OVERALL_STATUS.INSUFFICIENT_EVIDENCE;
  let explanation = '';

  if (counts.contradicted > 0) {
    overallStatus = OVERALL_STATUS.CONFLICTING_EVIDENCE;
    explanation = `Verification flagged ${counts.contradicted} direct contradiction(s) in the submitted evidence. While some parts may hold, conflicting data prevents affirmation of the overall claim.`;
  } else if (coveragePercent >= 75 && evidenceStrength >= 65 && counts.supported >= Math.ceil(counts.total * 0.5)) {
    overallStatus = OVERALL_STATUS.WELL_SUPPORTED;
    explanation = `The evidence comprehensively covers ${coveragePercent}% of the claim's sub-components with a high composite strength score of ${evidenceStrength}/100. High-confidence supporting sources confirm the key assertions.`;
  } else if (coveragePercent >= 40 && (counts.supported > 0 || counts.partial > 0)) {
    overallStatus = OVERALL_STATUS.PARTIALLY_SUPPORTED;
    explanation = `The claim is partially substantiated (${coveragePercent}% coverage, score ${evidenceStrength}/100). ${counts.supported} subclaim(s) are supported and ${counts.partial} partially supported, but ${counts.missing} assertion(s) still lack conclusive evidence.`;
  } else {
    overallStatus = OVERALL_STATUS.INSUFFICIENT_EVIDENCE;
    explanation = `Insufficient evidence has been provided (${coveragePercent}% coverage). ${counts.missing} of ${counts.total} subclaims lack matching evidence snippets or verified source documentation.`;
  }

  return {
    mainClaim,
    coveragePercent,
    evidenceStrength,
    subclaimResults: evaluatedSubclaims,
    counts,
    overallStatus,
    explanation
  };
}

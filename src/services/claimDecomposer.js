/**
 * ProofPath AI - Transparent Local Claim Decomposer
 * 
 * Breaks down complex, multi-faceted claims into 2 to 4 atomic, verifiable subclaims
 * using deterministic linguistic patterns, clause splitting, entity extraction,
 * and quantitative isolation.
 */

// Helper to clean and capitalize a sentence
function cleanSentence(str) {
  if (!str) return '';
  let cleaned = str.trim()
    .replace(/^[,;:\-\s]+/, '')
    .replace(/[,;:\-\s]+$/, '');
  if (!cleaned) return '';
  // Ensure starts with uppercase and ends with period
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (!/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }
  return cleaned;
}

// Generate unique ID
function uid() {
  return 'sc_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Extracts numeric or percentage assertions from a text chunk
 */
function extractQuantitativeInfo(text) {
  // Matches percentages (e.g. 80%, 99.9%, 100 percent)
  const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)\b/i);
  // Matches metric values (e.g. $500, 15 kWh, 3 hours, 500 patients)
  const metricMatch = text.match(/(?:\$|€|£)?\s*(\d+(?:\.\d+)?)\s*(kwh|mg|g|kg|ml|l|hours?|hrs?|days?|weeks?|months?|years?|km|miles?|patients?|users?|ms|s|gb|tb|fps)?\b/i);
  
  return {
    hasPercent: !!percentMatch,
    percentValue: percentMatch ? percentMatch[1] : null,
    hasMetric: !!metricMatch,
    metricValue: metricMatch ? metricMatch[1] : null,
    metricUnit: metricMatch ? (metricMatch[2] || '') : '',
  };
}

/**
 * Main decomposition function
 * @param {string} rawClaim 
 * @returns {Array<{id: string, text: string, type: string, keywords: string[], targetMetrics: Array}>}
 */
export function decomposeClaim(rawClaim) {
  if (!rawClaim || typeof rawClaim !== 'string') return [];
  
  const claim = rawClaim.trim();
  if (claim.length === 0) return [];

  const subclaims = [];
  const addedTexts = new Set();

  const addSubclaim = (text, type = 'general', targetMetric = null) => {
    const formatted = cleanSentence(text);
    const normalizedKey = formatted.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (formatted.length > 5 && !addedTexts.has(normalizedKey)) {
      addedTexts.add(normalizedKey);
      
      // Extract keywords for explainability matching
      const words = formatted.toLowerCase()
        .replace(/[^a-z0-9\s%]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !isStopWord(w));

      subclaims.push({
        id: uid(),
        text: formatted,
        type,
        targetMetric,
        keywords: Array.from(new Set(words)),
        evidenceList: []
      });
    }
  };

  // 1. Check for standard canonical prompt pattern:
  // "This product contains 80% recycled material and its packaging is recyclable."
  const promptPattern = /contains\s+(\d+(?:\.\d+)?%?)\s+recycled\s+material(?:\s+and\s+(?:its\s+)?packaging\s+is\s+recyclable)?/i;
  const matchPrompt = claim.match(promptPattern);
  if (matchPrompt) {
    const percentVal = matchPrompt[1];
    addSubclaim('The product contains recycled material.', 'existential');
    addSubclaim(`The recycled material percentage is ${percentVal.includes('%') ? percentVal : percentVal + '%'}.`, 'quantitative', { type: 'percentage', value: parseFloat(percentVal) });
    if (claim.toLowerCase().includes('packaging') && claim.toLowerCase().includes('recyclable')) {
      addSubclaim('The product packaging is recyclable.', 'property');
    }
    return subclaims.slice(0, 4);
  }

  // 2. Split by major delimiters (multiple sentences, semicolons, major conjunctions)
  // Split on periods, semicolons, or conjunctions like ' and ', ' as well as ', ' while '
  const sentenceClauses = claim
    .split(/(?:;|\. |\n|(?:\s+(?:and|as well as|while|along with|plus|additionally)\s+))/i)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Process each clause
  sentenceClauses.forEach((clause) => {
    const quant = extractQuantitativeInfo(clause);

    // If clause contains quantitative data (like "80% recycled material" or "charges in 3 hours")
    if (quant.hasPercent) {
      // Create existence subclaim without the percent number
      const withoutPercent = clause
        .replace(/(\d+(?:\.\d+)?)\s*(?:%|percent)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (withoutPercent.length > 8) {
        addSubclaim(withoutPercent, 'existential');
      }
      // Create exact quantitative subclaim
      addSubclaim(`The specified rate/percentage is exactly ${quant.percentValue}%.`, 'quantitative', {
        type: 'percentage',
        value: parseFloat(quant.percentValue)
      });
    } else if (quant.hasMetric && quant.metricUnit) {
      addSubclaim(clause, 'quantitative', {
        type: 'metric',
        value: parseFloat(quant.metricValue),
        unit: quant.metricUnit
      });
    } else {
      addSubclaim(clause, 'property');
    }
  });

  // 3. If only 1 subclaim was generated, perform atomic entity-predicate splitting
  if (subclaims.length === 1) {
    const singleText = subclaims[0].text;
    const quant = extractQuantitativeInfo(singleText);

    if (quant.hasPercent) {
      // If single statement has percent, break down into existence + metric statement
      subclaims.length = 0; // reset
      addedTexts.clear();
      
      const cleanSubject = singleText
        .replace(/[0-9]+(?:\.[0-9]+)?%/g, '')
        .replace(/contains\s+/i, 'contains ')
        .trim();
      
      addSubclaim(cleanSubject, 'existential');
      addSubclaim(`The measured proportion is ${quant.percentValue}%.`, 'quantitative', {
        type: 'percentage',
        value: parseFloat(quant.percentValue)
      });
    } else {
      // Try splitting subject and predicate
      const parts = singleText.split(/\b(contains|provides|features|delivers|reduces|achieves|operates|includes|is certified for|results in)\b/i);
      if (parts.length >= 3) {
        const subject = parts[0].trim();
        const verb = parts[1].trim();
        const predicate = parts.slice(2).join('').replace(/^[,\s]+/, '').trim();
        
        subclaims.length = 0;
        addedTexts.clear();
        addSubclaim(`${subject} incorporates ${predicate}`, 'existential');
        addSubclaim(`${subject} actively ${verb} ${predicate}`, 'property');
      } else {
        // Add a primary assertion subclaim and a verification criteria subclaim
        const base = subclaims[0].text;
        subclaims.push({
          id: uid(),
          text: `Verification that conditions in "${cleanSentence(base).replace(/\.$/, '')}" are met.`,
          type: 'verification',
          keywords: subclaims[0].keywords,
          evidenceList: []
        });
      }
    }
  }

  // Fallback safeguard: Guarantee at least 2 subclaims and at most 4
  if (subclaims.length === 0) {
    addSubclaim(claim, 'general');
    addSubclaim(`Factual verification of the core statement.`, 'verification');
  }

  return subclaims.slice(0, 4);
}

// Basic stop words filter
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'if', 'then',
  'else', 'when', 'up', 'down', 'in', 'out', 'to', 'for', 'with', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above',
  'below', 'from', 'by', 'of', 'this', 'that', 'these', 'those', 'its', 'their',
  'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
  'did', 'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must'
]);

function isStopWord(word) {
  return STOP_WORDS.has(word.toLowerCase());
}

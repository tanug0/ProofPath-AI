/**
 * ProofPath AI - Export & Audit Utilities
 */

export function exportAnalysisAsJSON(analysisData) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `proofpath_audit_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportAnalysisAsMarkdown(analysisData) {
  const { mainClaim, coveragePercent, evidenceStrength, overallStatus, explanation, subclaimResults, counts } = analysisData;
  
  let md = `# ProofPath AI — Evidence Assessment Report\n\n`;
  md += `**Date:** ${new Date().toLocaleString()}\n`;
  md += `**Main Claim:** "${mainClaim}"\n\n`;
  md += `## Overall Verdict: ${overallStatus}\n`;
  md += `- **Evidence Coverage:** ${coveragePercent}%\n`;
  md += `- **Evidence Strength Score:** ${evidenceStrength}/100\n`;
  md += `- **Breakdown:** ${counts.supported} Supported | ${counts.partial} Partially Supported | ${counts.contradicted} Contradicted | ${counts.missing} Missing\n\n`;
  md += `### Executive Summary\n${explanation}\n\n`;
  md += `---\n\n## Subclaim & Evidence Detail\n\n`;

  subclaimResults.forEach((sc, idx) => {
    md += `### ${idx + 1}. ${sc.text}\n`;
    md += `- **Status:** ${sc.status}\n`;
    md += `- **Strength Score:** ${sc.strengthScore}/100\n`;
    md += `- **Assessment Rationale:** ${sc.primaryRationale}\n`;
    
    if (sc.evidenceList && sc.evidenceList.length > 0) {
      md += `\n**Submitted Evidence Items:**\n`;
      sc.evidenceList.forEach((ev, evIdx) => {
        md += `  ${evIdx + 1}. "${ev.text}"\n`;
        if (ev.sourceName) md += `     - *Source:* ${ev.sourceName}\n`;
        if (ev.sourceUrl) md += `     - *URL:* ${ev.sourceUrl}\n`;
      });
    } else {
      md += `\n*No evidence submitted for this subclaim.*\n`;
    }
    md += `\n`;
  });

  md += `\n---\n*Generated locally and explainably by ProofPath AI.*`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `proofpath_report_${Date.now()}.md`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

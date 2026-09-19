/**
 * ProofPath AI - Demo Scenarios
 * 
 * Provides preconfigured realistic scenarios for fast demonstration in under 60 seconds.
 */

export const DEMO_SCENARIOS = [
  {
    id: 'eco-claim',
    title: 'Recycled Materials & Packaging (Standard Demo)',
    tag: 'Product Sustainability',
    claim: 'This product contains 80% recycled material and its packaging is recyclable.',
    subclaims: [
      {
        id: 'sc_eco_1',
        text: 'The product contains recycled material.',
        type: 'existential',
        keywords: ['product', 'contains', 'recycled', 'material'],
        evidenceList: [
          {
            id: 'ev_eco_1',
            text: 'Third-party audit report from GreenCert Labs confirms post-consumer recycled (PCR) plastic materials are integrated into product manufacturing.',
            sourceName: 'GreenCert Compliance Verification 2024-A',
            sourceUrl: 'https://greencert.org/reports/audit-2024-a',
            addedAt: '2026-09-18T10:30:00Z'
          }
        ]
      },
      {
        id: 'sc_eco_2',
        text: 'The recycled material percentage is 80%.',
        type: 'quantitative',
        targetMetric: { type: 'percentage', value: 80 },
        keywords: ['recycled', 'material', 'percentage', '80%'],
        evidenceList: [
          {
            id: 'ev_eco_2',
            text: 'Official Bill of Materials (BOM) specifies that the device chassis utilizes 45% post-consumer resin with remaining 55% virgin polymer.',
            sourceName: 'Supplier Engineering Spec v3.2',
            sourceUrl: 'https://supply.mfg-partner.com/specs/bom-v32.pdf',
            addedAt: '2026-09-18T11:15:00Z'
          }
        ]
      },
      {
        id: 'sc_eco_3',
        text: 'The product packaging is recyclable.',
        type: 'property',
        keywords: ['product', 'packaging', 'recyclable'],
        evidenceList: [] // Intentionally empty to showcase MISSING status
      }
    ]
  },
  {
    id: 'energy-claim',
    title: 'Clean Energy & Fast Charging',
    tag: 'Hardware Tech',
    claim: 'Our solar battery system delivers 15kWh capacity and charges in under 3 hours.',
    subclaims: [
      {
        id: 'sc_en_1',
        text: 'The solar battery system delivers 15kWh capacity.',
        type: 'quantitative',
        targetMetric: { type: 'unit_metric', value: 15, unit: 'kwh' },
        keywords: ['solar', 'battery', 'system', 'delivers', '15kwh', 'capacity'],
        evidenceList: [
          {
            id: 'ev_en_1',
            text: 'Independent lab test by UL Solutions measured total usable energy storage at 15.0 kWh under standard discharge cycles.',
            sourceName: 'UL Battery Certification #9921',
            sourceUrl: 'https://cert.ul.com/report/9921-15kwh',
            addedAt: '2026-09-19T08:00:00Z'
          }
        ]
      },
      {
        id: 'sc_en_2',
        text: 'The system charges in under 3 hours.',
        type: 'property',
        keywords: ['system', 'charges', 'under', 'hours'],
        evidenceList: [
          {
            id: 'ev_en_2',
            text: 'Bench test results confirmed 0% to 100% full fast-charging cycle was achieved in 2 hours and 42 minutes using standard 40A solar feed.',
            sourceName: 'CleanEnergy Field Bench Test Log',
            sourceUrl: 'https://cleanenergy-bench.org/test/charge-time-2024',
            addedAt: '2026-09-19T08:20:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'medical-claim',
    title: 'Clinical Trial Efficacy & Safety',
    tag: 'Health & Science',
    claim: 'Clinical trials demonstrated 92% efficacy with zero serious adverse side effects.',
    subclaims: [
      {
        id: 'sc_med_1',
        text: 'Clinical trials demonstrated 92% efficacy.',
        type: 'quantitative',
        targetMetric: { type: 'percentage', value: 92 },
        keywords: ['clinical', 'trials', 'demonstrated', '92%', 'efficacy'],
        evidenceList: [
          {
            id: 'ev_med_1',
            text: 'Phase 3 double-blind randomized clinical trial documented a 92% response rate in the primary endpoint cohort.',
            sourceName: 'Journal of Medical Therapeutics Vol 14',
            sourceUrl: 'https://jmed-therapeutics.org/papers/p3-efficacy-2025',
            addedAt: '2026-09-17T14:10:00Z'
          }
        ]
      },
      {
        id: 'sc_med_2',
        text: 'There were zero serious adverse side effects.',
        type: 'property',
        keywords: ['zero', 'serious', 'adverse', 'side', 'effects'],
        evidenceList: [
          {
            id: 'ev_med_2',
            text: 'Safety registry noted 4 patients (1.2%) experienced grade-3 allergic dermatitis requiring clinical intervention and monitored withdrawal.',
            sourceName: 'Adverse Reaction Registry DSMB Report',
            sourceUrl: 'https://safety-dsmb.org/trials/study-402-safety',
            addedAt: '2026-09-17T14:40:00Z'
          }
        ]
      }
    ]
  }
];

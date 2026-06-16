// Per-year, per-DCED-category breakdown by borough fund.
// Each entry is an array of { name, value } pairs (non-zero funds only),
// sourced from the DCED CLGS-30 fund columns in the annual audit.
// Categories match COMPARE_CATEGORIES in auditData.js.

export const auditDrilldown = {
  2025: {
    'General Government': [
      { name: 'General Fund', value: 753408 },
      { name: 'Special Revenue', value: 3106 },
      { name: 'Enterprise Fund', value: 11892 },
      { name: 'Trust & Agency', value: 73598 },
    ],
    'Fire': [
      { name: 'General Fund', value: 36782 },
      { name: 'Capital Projects', value: 318427 },
    ],
    'Public Works': [
      { name: 'General Fund', value: 419590 },
      { name: 'Special Revenue', value: 162889 },
      { name: 'Capital Projects', value: 213338 },
      { name: 'Enterprise Fund', value: 425721 },
    ],
    'Sewer / Wastewater': [
      { name: 'Enterprise Fund', value: 55338 },
      { name: 'Capital Projects', value: 7442 },
    ],
    'Debt Service': [
      { name: 'General Fund', value: 366754 },
      { name: 'Special Revenue', value: 64500 },
      { name: 'Enterprise Fund', value: 111101 },
    ],
  },
};

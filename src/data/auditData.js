// Actual expenditures from DCED CLGS-30 Annual Audit & Financial Report (Memorandum Only totals).
// Categories follow DCED functional classification, not the borough's fund-based budget structure.

export const AUDIT_YEARS = [2025, 2024, 2023, 2022];

export const COMPARE_CATEGORIES = [
  'General Government',
  'Police',
  'Fire',
  'Planning & Zoning',
  'Public Works',
  'Solid Waste',
  'Sewer / Wastewater',
  'Libraries',
  'Employee Benefits',
  'Debt Service',
];

export const auditActuals = {
  2022: {
    'General Government': 584496,
    'Police': 1842526,
    'Fire': 208011,
    'Planning & Zoning': 255826,
    'Public Works': 607845,
    'Solid Waste': 471550,
    'Sewer / Wastewater': 347787,
    'Libraries': 222000,
    'Employee Benefits': 1978443,
    'Debt Service': 842378,
  },
  2023: {
    'General Government': 672597,
    'Police': 1933499,
    'Fire': 221667,
    'Planning & Zoning': 270543,
    'Public Works': 951943,
    'Solid Waste': 425993,
    'Sewer / Wastewater': 419468,
    'Libraries': 244053,
    'Employee Benefits': 1301984,
    'Debt Service': 864252,
  },
  2024: {
    'General Government': 787104,
    'Police': 2005712,
    'Fire': 241195,
    'Planning & Zoning': 209610,
    'Public Works': 1517395,
    'Solid Waste': 545761,
    'Sewer / Wastewater': 271701,
    'Libraries': 285079,
    'Employee Benefits': 1000666,
    'Debt Service': 910310,
  },
  2025: {
    'General Government': 842004,
    'Police': 1775658,
    'Fire': 355209,
    'Planning & Zoning': 206594,
    'Public Works': 1221538,
    'Solid Waste': 502371,
    'Sewer / Wastewater': 62780,
    'Libraries': 282874,
    'Employee Benefits': 994357,
    'Debt Service': 833139,
  },
};

// Borough approved budget expenditures mapped to DCED functional categories.
// Approximate — the borough budget uses fund-based categories; see source/audits/ for methodology.
export const budgetMapped = {
  2022: {
    // Legislative Body $300,929 + Executive $128,799 + Tax Collection $36,348 + IT $3,600 + Buildings $37,100 + Reserve $141,800
    'General Government': 648576,
    'Police': 1729475,
    // Fire Protection Fund total
    'Fire': 176104,
    'Planning & Zoning': 152040,
    // GF Public Works $304,473 + Street Tax Fund $178,737 + State Liquid Fuels $151,034
    'Public Works': 634244,
    'Solid Waste': 446727,
    'Sewer / Wastewater': 634099,
    'Libraries': 234815,
    // GF Employee Benefits only
    'Employee Benefits': 592274,
    // Debt Service Fund $264,126 + GF Debt Principal $350,000 + GF Debt Interest $8,750
    'Debt Service': 622876,
  },
  2023: {
    // Admin $560,271 + Reserve & Misc $190,880
    'General Government': 751151,
    'Police': 1763317,
    // Fire Protection Fund total
    'Fire': 191234,
    'Planning & Zoning': 188971,
    // GF Public Works $350,694 + Street Tax Fund $115,960 + State Liquid Fuels $263,652
    'Public Works': 730306,
    'Solid Waste': 492051,
    'Sewer / Wastewater': 820615,
    'Libraries': 231996,
    // GF Employee Benefits only
    'Employee Benefits': 699275,
    // Debt Service Fund $260,175 + GF Debt Service $360,500
    'Debt Service': 620675,
  },
  2024: {
    // Admin $485,789 + Reserve & Misc $386,237
    'General Government': 872026,
    'Police': 1870575,
    // Fire Protection Fund total (Fire Apparatus capital transfer excluded)
    'Fire': 185391,
    'Planning & Zoning': 376023,
    // GF Public Works $356,577 + Street Tax Fund $108,500 + State Liquid Fuels $173,034
    'Public Works': 638111,
    'Solid Waste': 545461,
    'Sewer / Wastewater': 819231,
    'Libraries': 272363,
    // GF Employee Benefits only
    'Employee Benefits': 695190,
    // Debt Service Fund $294,986 + GF Debt Service $364,000
    'Debt Service': 658986,
  },
  2025: {
    // Admin $320,700 + Legislative Body $371,277 + Reserve & Misc $255,698
    'General Government': 947675,
    'Police': 1742350,
    // Fire Protection $193,424 + Fire Apparatus $46,966
    'Fire': 240390,
    'Planning & Zoning': 211687,
    // GF Public Works $473,890 + Street Tax Fund $105,500 + State Liquid Fuels $153,034
    'Public Works': 732424,
    'Solid Waste': 556450,
    'Sewer / Wastewater': 686597,
    'Libraries': 270349,
    // GF Employee Benefits only
    'Employee Benefits': 909468,
    // Debt Service Fund $304,593 + GF Debt Service $369,000
    'Debt Service': 673593,
  },
};

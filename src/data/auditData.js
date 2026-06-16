// Actual expenditures from DCED CLGS-30 Annual Audit & Financial Report (Memorandum Only totals).
// Categories follow DCED functional classification, not the borough's fund-based budget structure.

export const AUDIT_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2013];

// Years with full fund-level budget detail available for compare chart
export const BUDGET_MAPPED_YEARS = new Set([2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]);

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
  2013: {
    'General Government': 651189,
    'Police': 1290331,
    'Fire': 186026,
    'Planning & Zoning': 34740,
    'Public Works': 1599883,
    'Solid Waste': 258929,
    'Sewer / Wastewater': 230592,
    'Libraries': 244794,
    'Employee Benefits': 643052,
    'Debt Service': 955710,
  },
  2015: {
    'General Government': 1249375,
    'Police': 1529176,
    'Fire': 181987,
    'Planning & Zoning': 101398,
    'Public Works': 529449,
    'Solid Waste': 300771,
    'Sewer / Wastewater': 326514,
    'Libraries': 231000,
    'Employee Benefits': 718575,
    'Debt Service': 2990597,
  },
  2016: {
    'General Government': 565096,
    'Police': 1580966,
    'Fire': 300416,
    'Planning & Zoning': 84135,
    'Public Works': 1024735,
    'Solid Waste': 284751,
    'Sewer / Wastewater': 257238,
    'Libraries': 239272,
    'Employee Benefits': 787069,
    'Debt Service': 310761,
  },
  2017: {
    'General Government': 588008,
    'Police': 1598834,
    'Fire': 189217,
    'Planning & Zoning': 112708,
    'Public Works': 860049,
    'Solid Waste': 293089,
    'Sewer / Wastewater': 563453,
    'Libraries': 239207,
    'Employee Benefits': 835320,
    'Debt Service': 286111,
  },
  2018: {
    'General Government': 628927,
    'Police': 1688912,
    'Fire': 549562,
    'Planning & Zoning': 132338,
    'Public Works': 1263554,
    'Solid Waste': 323471,
    'Sewer / Wastewater': 703020,
    'Libraries': 235568,
    'Employee Benefits': 1287383,
    'Debt Service': 319970,
  },
  2019: {
    'General Government': 577212,
    'Police': 1821986,
    'Fire': 1099539,
    'Planning & Zoning': 163960,
    'Public Works': 819777,
    'Solid Waste': 300345,
    'Sewer / Wastewater': 891744,
    'Libraries': 234889,
    'Employee Benefits': 1081060,
    'Debt Service': 395540,
  },
  2020: {
    'General Government': 550435,
    'Police': 1870001,
    'Fire': 226550,
    'Planning & Zoning': 118875,
    'Public Works': 1021594,
    'Solid Waste': 332395,
    'Sewer / Wastewater': 643301,
    'Libraries': 235397,
    'Employee Benefits': 1053668,
    'Debt Service': 492256,
  },
  2021: {
    'General Government': 528803,
    'Police': 1635699,
    'Fire': 192566,
    'Planning & Zoning': 150945,
    'Public Works': 771062,
    'Solid Waste': 312434,
    'Sewer / Wastewater': 246082,
    'Libraries': 211403,
    'Employee Benefits': 996098,
    'Debt Service': 844173,
  },
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
  2017: {
    // Administration $540,503 + Reserve & Misc $125,780
    'General Government': 666283,
    'Police': 1594516,
    // Fire Protection Fund total
    'Fire': 159570,
    'Planning & Zoning': 161050,
    // GF Public Works $320,331 + Street Tax Fund $231,000 + State Liquid Fuels $130,034
    'Public Works': 681365,
    'Solid Waste': 314060,
    'Sewer / Wastewater': 566577,
    'Libraries': 234823,
    // GF Employee Benefits only
    'Employee Benefits': 544677,
    // Debt Service Fund total
    'Debt Service': 248671,
  },
  2018: {
    // Administration $520,000 + Reserve & Misc $155,000
    'General Government': 675000,
    'Police': 1650000,
    // Fire Protection Fund total
    'Fire': 170650,
    'Planning & Zoning': 134966,
    // GF Public Works $285,000 + Street Tax Fund $271,214 + State Liquid Fuels $120,034
    'Public Works': 676248,
    'Solid Waste': 330942,
    'Sewer / Wastewater': 1418969,
    'Libraries': 232359,
    // GF Employee Benefits only
    'Employee Benefits': 632000,
    // Debt Service Fund total
    'Debt Service': 244996,
  },
  2019: {
    // Administration $544,000 + Reserve & Misc $161,000
    'General Government': 705000,
    'Police': 1729000,
    // Fire Protection Fund total
    'Fire': 187646,
    'Planning & Zoning': 149615,
    // GF Public Works $302,000 + Street Tax Fund $169,668 + State Liquid Fuels $155,034
    'Public Works': 626702,
    'Solid Waste': 337663,
    'Sewer / Wastewater': 547787,
    'Libraries': 233983,
    // GF Employee Benefits only
    'Employee Benefits': 664000,
    // Debt Service Fund total
    'Debt Service': 263321,
  },
  2020: {
    // Administration $546,000 + Reserve & Misc $161,648
    'General Government': 707648,
    'Police': 1736406,
    // Fire Protection Fund total
    'Fire': 161409,
    'Planning & Zoning': 150500,
    // GF Public Works $302,855 + Street Tax Fund $174,668 + State Liquid Fuels $119,534
    'Public Works': 597057,
    'Solid Waste': 367304,
    'Sewer / Wastewater': 964867,
    'Libraries': 234087,
    // GF Employee Benefits only
    'Employee Benefits': 667166,
    // Debt Service Fund only (no GF debt service in 2020)
    'Debt Service': 268511,
  },
  2021: {
    // Administration $474,388 + Reserve & Misc $102,500
    'General Government': 576888,
    'Police': 1610605,
    // Fire Protection Fund total
    'Fire': 166128,
    'Planning & Zoning': 137275,
    // GF Public Works $293,228 + Street Tax Fund $159,665 + State Liquid Fuels $113,034
    'Public Works': 565927,
    'Solid Waste': 372412,
    'Sewer / Wastewater': 1029983,
    'Libraries': 207570,
    // GF Employee Benefits only
    'Employee Benefits': 581741,
    // Debt Service Fund $267,560 + GF Debt Service $358,400
    'Debt Service': 625960,
  },
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

export const TREND_YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

export const TREND_FUNDS = [
  'General Fund',
  'Capital Projects Fund',
  'Sewer Fund',
  'Solid Waste Fund',
  'Police Pension Fund',
  'Debt Service Fund',
  'Library Fund',
  'Fire Protection Fund',
  'Non-Uniformed Pension Fund',
  'Fire Apparatus Fund',
  'State Liquid Fuels Fund',
  'Street Tax Fund',
  'Street Lighting Tax Fund',
  'Ambulance Service Fund',
];

// [null×5 = use actuals for 2017-2021, then 2022 Budget, 2023 Budget, 2024 Budget, 2025 Budget, 2026 Budget]
export const trends = {
  revenue: {
    'General Fund':               [null, null, null, null, null, 4818180, 4751204, 4714011, 5011524, 4867271],
    'Capital Projects Fund':      [null, null, null, null, null, 2252750, 1136180, 3470255,  299677, 2100074],
    'Sewer Fund':                 [null, null, null, null, null,  501400,  479400,  515100,  486058,  631750],
    'Solid Waste Fund':           [null, null, null, null, null,  447800,  553180,  551600,  581661,  556200],
    'Police Pension Fund':        [null, null, null, null, null,  428121,  395813,  395144, 1029734,  454563],
    'Debt Service Fund':          [null, null, null, null, null,  236114,  270623,  263593,  352012,  338442],
    'Library Fund':               [null, null, null, null, null,  234815,  231996,  272363,  262364,  274068],
    'Fire Protection Fund':       [null, null, null, null, null,  172483,  191079,  186099,  179035,  214569],
    'Non-Uniformed Pension Fund': [null, null, null, null, null,  103314,  111871,  121886,  204494,  133418],
    'Fire Apparatus Fund':        [null, null, null, null, null,   34714,   34650,   37644,  149794,  125895],
    'State Liquid Fuels Fund':    [null, null, null, null, null,  111254,  117269,  120800,  121538,  118500],
    'Street Tax Fund':            [null, null, null, null, null,  147012,   75433,   73192,   70334,   83488],
    'Street Lighting Tax Fund':   [null, null, null, null, null,   63653,   62966,   68486,   53517,   62143],
    'Ambulance Service Fund':     [null, null, null, null, null,       0,   13704,   13451,   12889,   13588],
  },
  expenditure: {
    'General Fund':               [null, null, null, null, null, 4636349, 4765818, 5116652, 5043325, 5378013],
    'Capital Projects Fund':      [null, null, null, null, null, 2010750, 1393780, 3682715,  200000, 2134143],
    'Sewer Fund':                 [null, null, null, null, null,  634099,  820615,  819231,  582902,  879730],
    'Solid Waste Fund':           [null, null, null, null, null,  446727,  492051,  545461,  569655,  595068],
    'Police Pension Fund':        [null, null, null, null, null,  275517,  336409,  338802,  313884,  373662],
    'Debt Service Fund':          [null, null, null, null, null,  264126,  260175,  294986,  301156,  313912],
    'Library Fund':               [null, null, null, null, null,  234815,  231996,  272363,  270349,  269500],
    'Fire Protection Fund':       [null, null, null, null, null,  176104,  191234,  185391,  178214,  228510],
    'Non-Uniformed Pension Fund': [null, null, null, null, null,   47012,   47012,   47012,   41046,   47012],
    'Fire Apparatus Fund':        [null, null, null, null, null,   34466,   32651,  340466,  192311,   34465],
    'State Liquid Fuels Fund':    [null, null, null, null, null,  151034,  263652,  173034,  114968,  122034],
    'Street Tax Fund':            [null, null, null, null, null,  178737,  115960,  108500,  106156,   98500],
    'Street Lighting Tax Fund':   [null, null, null, null, null,   58597,   68997,   67997,   45358,   61213],
    'Ambulance Service Fund':     [null, null, null, null, null,       0,   13704,   13451,   12525,   13456],
  },
};

// Year-end actual values sourced from:
//   2017 actuals → 2021 Budget "Summary by Fund" (p.12), "2017 Actual" column
//   2018–2021 actuals → 2024 Budget "Summary by Fund" (Appendix C), columns "2018 Actual"–"2021 Actual"
//   2023 actuals → 2024 Budget "2023 Year end Projection" column
export const actuals = {
  revenue: {
    'General Fund':               { 2017: 3606861, 2018: 3844897, 2019: 4042810, 2020: 3655275, 2021: 4311280, 2023: 5337312 },
    'Capital Projects Fund':      { 2017:   11367, 2018:  591584, 2019:  317318, 2020:  613052, 2021:  293482, 2023:  407221 },
    'Sewer Fund':                 { 2017:  407423, 2018:  436646, 2019: 1823047, 2020:  485695, 2021:  448941, 2023:  456926 },
    'Solid Waste Fund':           { 2017:  273492, 2018:  348243, 2019:  338794, 2020:  325991, 2021:  323016, 2023:  581011 },
    'Police Pension Fund':        { 2017:  897110, 2018:  -39277, 2019: 1203098, 2020:  801280, 2021:  951311, 2023:  574472 },
    'Debt Service Fund':          { 2017:  250505, 2018:  252553, 2019:  251908, 2020:  246261, 2021:  195190, 2023:  336542 },
    'Library Fund':               { 2017:  234530, 2018:  235673, 2019:  234787, 2020:  230495, 2021:  212137, 2023:  232871 },
    'Fire Protection Fund':       { 2017:  168956, 2018:  169946, 2019:  169305, 2020:  167151, 2021:  174131, 2023:  191297 },
    'Non-Uniformed Pension Fund': { 2017:  151097, 2018:   32597, 2019:  219454, 2020:  192830, 2021:  233004, 2023:   63877 },
    'Fire Apparatus Fund':        { 2017:  129988, 2018:  133836, 2019:  434662, 2020:  126854, 2021:   35453, 2023:   46871 },
    'State Liquid Fuels Fund':    { 2017:  116251, 2018:  122748, 2019:  125658, 2020:  121508, 2021:  112918, 2023:  123174 },
    'Street Tax Fund':            { 2017:  156074, 2018:  201880, 2019:  111221, 2020:  212272, 2021:   88055, 2023:   76361 },
    'Street Lighting Tax Fund':   { 2017:  176080, 2018:   64181, 2019:   57413, 2020:   59168, 2021:   69525, 2023:   56832 },
    'Ambulance Service Fund':     {                                                              2023:   13300 },
  },
  expenditure: {
    'General Fund':               { 2017: 3836354, 2018: 4086218, 2019: 4192472, 2020: 4027379, 2021: 4398357, 2023: 5018516 },
    'Capital Projects Fund':      { 2017:  123611, 2018:  617069, 2019:  388796, 2020:  754788, 2021:  321355, 2023:  394172 },
    'Sewer Fund':                 { 2017:  606023, 2018:  570672, 2019:  967529, 2020:  714075, 2021:  498313, 2023:  587705 },
    'Solid Waste Fund':           { 2017:  304165, 2018:  323686, 2019:  306845, 2020:  362395, 2021:  343434, 2023:  449318 },
    'Police Pension Fund':        { 2017:  348545, 2018:  316920, 2019:  298455, 2020:  285865, 2021:  284578, 2023:  355303 },
    'Debt Service Fund':          { 2017:  248671, 2018:  244996, 2019:  263314, 2020:  267421, 2021:  265698, 2023:  300970 },
    'Library Fund':               { 2017:  239207, 2018:  235568, 2019:  234889, 2020:  235397, 2021:  211403, 2023:  237871 },
    'Fire Protection Fund':       { 2017:  159046, 2018:  171381, 2019:  196352, 2020:  157756, 2021:  167235, 2023:  194241 },
    'Non-Uniformed Pension Fund': { 2017:   38756, 2018:   31874, 2019:   33360, 2020:   29883, 2021:   44062, 2023:   53427 },
    'Fire Apparatus Fund':        {                2018:  351643, 2019:  736919, 2020:   71701, 2021:   37700, 2023:   39466 },
    'State Liquid Fuels Fund':    { 2017:   86107, 2018:  147957, 2019:  143278, 2020:   49852, 2021:  110644, 2023:  187698 },
    'Street Tax Fund':            { 2017:  214160, 2018:  319007, 2019:  169194, 2020:  102462, 2021:  143900, 2023:   93985 },
    'Street Lighting Tax Fund':   { 2017:  124324, 2018:  146770, 2019:   63392, 2020:   57214, 2021:   51439, 2023:   77083 },
    'Ambulance Service Fund':     {                                                              2023:   13451 },
  },
};

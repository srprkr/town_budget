// Jenkintown School District General Fund Budget
// Keyed by fiscal-year ending calendar year (e.g. fiscal 2024-25 → key 2025)
//
// 2021–2025: School District of Jenkintown 2024-25 Budget Presentation (May 20, 2024)
//   - Expenditure by PDE object code; 2020-21/2021-22/2022-23 are actuals, 2023-24/2024-25 are budget
//   - Revenue by source (local/state/federal); same years/types as above
// 2026: 2025-26 Proposed Preliminary General Fund Budget (March 10, 2025)
//   - Expenditure by PDE function code (different categorisation from 2021-2025)

export const schoolBudgets = {
  2021: {
    revenue: [
      { name: 'Local Revenue',   value: 13694207 },
      { name: 'State Revenue',   value:  3657274 },
      { name: 'Federal Revenue', value:   191022 },
    ],
    expenditure: [
      { name: 'Salaries',                   value:  7785975 },
      { name: 'Benefits',                   value:  4158244 },
      { name: 'Professional Services',      value:   930365 },
      { name: 'Property Services',          value:   813742 },
      { name: 'Other Purchased Services',   value:  1271838 },
      { name: 'Supplies',                   value:   516826 },
      { name: 'Property',                   value:   221229 },
      { name: 'Debt Service Interest/Dues', value:   756446 },
      { name: 'Debt Service & Transfers',   value:   710000 },
    ],
  },
  2022: {
    revenue: [
      { name: 'Local Revenue',   value: 13901764 },
      { name: 'State Revenue',   value:  3489401 },
      { name: 'Federal Revenue', value:   464053 },
    ],
    expenditure: [
      { name: 'Salaries',                   value:  7870916 },
      { name: 'Benefits',                   value:  4284016 },
      { name: 'Professional Services',      value:  1075064 },
      { name: 'Property Services',          value:   837373 },
      { name: 'Other Purchased Services',   value:  1411168 },
      { name: 'Supplies',                   value:   580876 },
      { name: 'Property',                   value:   130131 },
      { name: 'Debt Service Interest/Dues', value:   794997 },
      { name: 'Debt Service & Transfers',   value:   750000 },
    ],
  },
  2023: {
    revenue: [
      { name: 'Local Revenue',   value: 14812341 },
      { name: 'State Revenue',   value:  3715807 },
      { name: 'Federal Revenue', value:   420675 },
    ],
    expenditure: [
      { name: 'Salaries',                   value:  7760553 },
      { name: 'Benefits',                   value:  4567196 },
      { name: 'Professional Services',      value:  1120434 },
      { name: 'Property Services',          value:   858708 },
      { name: 'Other Purchased Services',   value:  1290235 },
      { name: 'Supplies',                   value:   540769 },
      { name: 'Property',                   value:    78352 },
      { name: 'Debt Service Interest/Dues', value:   793954 },
      { name: 'Debt Service & Transfers',   value:   765000 },
    ],
  },
  2024: {
    revenue: [
      { name: 'Local Revenue',   value: 14433916 },
      { name: 'State Revenue',   value:  3744045 },
      { name: 'Federal Revenue', value:   334100 },
    ],
    expenditure: [
      { name: 'Salaries',                   value:  8153238 },
      { name: 'Benefits',                   value:  4978598 },
      { name: 'Professional Services',      value:   977722 },
      { name: 'Property Services',          value:   868025 },
      { name: 'Other Purchased Services',   value:  1403675 },
      { name: 'Supplies',                   value:   552375 },
      { name: 'Property',                   value:    87071 },
      { name: 'Debt Service Interest/Dues', value:   693857 },
      { name: 'Debt Service & Transfers',   value:   797500 },
    ],
  },
  2025: {
    revenue: [
      { name: 'Local Revenue',   value: 15072917 },
      { name: 'State Revenue',   value:  4157386 },
      { name: 'Federal Revenue', value:    96100 },
    ],
    expenditure: [
      { name: 'Salaries',                   value:  8345986 },
      { name: 'Benefits',                   value:  5188443 },
      { name: 'Professional Services',      value:  1005450 },
      { name: 'Property Services',          value:  1069500 },
      { name: 'Other Purchased Services',   value:  1620081 },
      { name: 'Supplies',                   value:   502546 },
      { name: 'Property',                   value:    88495 },
      { name: 'Debt Service Interest/Dues', value:   688402 },
      { name: 'Debt Service & Transfers',   value:   817500 },
    ],
  },
  2026: {
    revenue: [
      { name: 'Local Revenue',   value: 15800962 },
      { name: 'State Revenue',   value:  4281163 },
      { name: 'Federal Revenue', value:    90198 },
    ],
    expenditure: [
      { name: 'Instruction',                      value: 10781350 },
      { name: 'Support Services',                 value:  7050051 },
      { name: 'Student Activities & Community',   value:   905866 },
      { name: 'Debt Service & Other',             value:  1435055 },
    ],
  },
};

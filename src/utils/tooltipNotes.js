const BENEFITS_ANOMALY_YEARS = new Set([2018, 2022, 2023]);
const SEWER_CAPITAL_DELAY_YEARS = new Set([2020, 2021]);
const SEWER_CAPITAL_GRANT_YEARS = new Set([2018, 2019]);
const FIRE_APPARATUS_YEARS = new Set([2016, 2018, 2019]);
const DEBT_REFINANCING_YEARS = new Set([2015]);
const GEN_GOV_ANOMALY_YEARS = new Set([2015]);

export function getTooltipNote(name, year) {
  if (name === 'Employee Benefits' && BENEFITS_ANOMALY_YEARS.has(year)) {
    return 'Includes pension fund activity (fiduciary) in the DCED totals, inflating this figure vs. other years.';
  }
  if (name === 'Sewer / Wastewater' && SEWER_CAPITAL_DELAY_YEARS.has(year)) {
    return 'Sewer rehabilitation capital project was budgeted but delayed; actual reflects operating costs only.';
  }
  if (name === 'Sewer / Wastewater' && SEWER_CAPITAL_GRANT_YEARS.has(year)) {
    return 'Budget included large grant-funded sewer rehabilitation; actual capital spending occurred but came in below the full budgeted amount.';
  }
  if (name === 'Fire' && FIRE_APPARATUS_YEARS.has(year)) {
    if (year === 2019) return 'Includes ~$881K capital purchase of a new fire truck; recurring fire costs are closer to $220K.';
    if (year === 2018) return 'Includes ~$352K fire apparatus capital expenditure; recurring fire costs are closer to $200K.';
    if (year === 2016) return 'Includes ~$105K fire apparatus capital expenditure; recurring fire costs are closer to $195K.';
  }
  if (name === 'Debt Service' && DEBT_REFINANCING_YEARS.has(year)) {
    return 'Includes ~$2.9M in debt principal from a bond refinancing; not representative of typical annual debt service.';
  }
  if (name === 'General Government' && GEN_GOV_ANOMALY_YEARS.has(year)) {
    return 'Includes a large one-time item under "Other General Government Administration" (~$560K); typical General Government spend is closer to $600K.';
  }
  return null;
}

const BENEFITS_ANOMALY_YEARS = new Set([2018, 2022, 2023]);
const SEWER_CAPITAL_DELAY_YEARS = new Set([2020, 2021]);
const SEWER_CAPITAL_GRANT_YEARS = new Set([2018, 2019]);
const FIRE_APPARATUS_YEARS = new Set([2018, 2019]);

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
    return 'Includes ~$881K capital purchase of a new fire truck; recurring fire costs are closer to $220K.';
  }
  return null;
}

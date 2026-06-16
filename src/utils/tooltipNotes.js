const BENEFITS_ANOMALY_YEARS = new Set([2022, 2023]);
const SEWER_CAPITAL_DELAY_YEARS = new Set([2020, 2021]);

export function getTooltipNote(name, year) {
  if (name === 'Employee Benefits' && BENEFITS_ANOMALY_YEARS.has(year)) {
    return 'Includes pension fund activity (fiduciary) in the DCED totals, inflating this figure vs. other years.';
  }
  if (name === 'Sewer / Wastewater' && SEWER_CAPITAL_DELAY_YEARS.has(year)) {
    return 'Sewer rehabilitation capital project was budgeted but delayed; actual reflects operating costs only.';
  }
  return null;
}

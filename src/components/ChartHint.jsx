const SCHOOL_SOURCES = {
  2025: 'https://www.jenkintowndrakes.org/wp-content/uploads/2024/06/JSD-BUDGET-PRESENTATION-24.25.pdf',
  2026: 'https://jenkintowndrakes.org/wp-content/uploads/2025/05/2025-26-Budget-3.10.25-updated.pdf',
};

const ChartHint = ({ breadcrumb, source, year }) => {
  const schoolUrl = SCHOOL_SOURCES[year];
  const showBorough = source !== 'school';
  const showSchool = source !== 'borough' && schoolUrl;

  return (
    <div className="zoom-hint">
      {breadcrumb.length === 0
        ? 'Click a fund to drill down · Scroll to zoom · Double-click to reset zoom'
        : `Viewing: ${breadcrumb[breadcrumb.length - 1]} · Click center to return`}
      <br />
      {showBorough && <a target="_blank" rel="noreferrer" href="https://jenkintownboro.com/budgets/">Borough source</a>}
      {showBorough && showSchool && ' · '}
      {showSchool && <a target="_blank" rel="noreferrer" href={schoolUrl}>School district source</a>}
    </div>
  );
};

export default ChartHint;

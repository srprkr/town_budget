const ChartHint = ({ breadcrumb }) => (
  <div className="zoom-hint">
    {breadcrumb.length === 0
      ? 'Click a fund to drill down · Scroll to zoom · Double-click to reset zoom'
      : `Viewing: ${breadcrumb[breadcrumb.length - 1]} · Click center to return`}
    <br />
    <a target="_blank" href="https://jenkintownboro.com/budgets/">Source</a>
  </div>
);

export default ChartHint;

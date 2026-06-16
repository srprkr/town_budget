import { useRef, useState } from 'react';
import { useCompareChart } from '../hooks/useCompareChart';
import { COMPARE_CATEGORIES, auditActuals, budgetMapped } from '../data/auditData';
import { fmtValue } from '../utils/format';
import './CompareChart.css';

const CompareChart = ({ year }) => {
  const [tab, setTab] = useState('category');
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);
  const actuals = auditActuals[year] ?? {};
  const budget = budgetMapped[year] ?? {};

  useCompareChart({ svgRef, actuals, budget, mode: tab, setTooltip, year });

  const tooltipDiff = tooltip ? tooltip.actualVal - tooltip.budgetVal : 0;

  return (
    <div className="compare-wrap">
      <p className="compare-title">{year} Budgeted vs. Audited Expenditures</p>
      <p className="compare-note">
        Budget figures are approximate — the borough budget uses fund-based categories while the independent audit uses DCED functional categories.
      </p>
      <div className="compare-tabs">
        <button
          className={`compare-tab ${tab === 'category' ? 'active' : ''}`}
          onClick={() => setTab('category')}
        >
          By Category
        </button>
        <button
          className={`compare-tab ${tab === 'total' ? 'active' : ''}`}
          onClick={() => setTab('total')}
        >
          Total
        </button>
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: 800 }}>
        <svg
          ref={svgRef}
          viewBox={tab === 'category' ? '0 0 800 500' : '0 0 800 210'}
          width="100%"
          aria-label={`${year} budgeted vs. audited expenditures${tab === 'total' ? ' totals' : ' by category'}`}
        />
        {tooltip && (
          <div
            className="tooltip"
            style={{ position: 'absolute', left: tooltip.x + 12, top: tooltip.y + 12, pointerEvents: 'none', zIndex: 1000 }}
          >
            <div className="tooltip-name">{tooltip.cat}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted, #aaa)', marginBottom: 2 }}>Budgeted: <span style={{ color: 'var(--text-h)', fontWeight: 600 }}>{fmtValue(tooltip.budgetVal)}</span></div>
            <div style={{ fontSize: 12, color: 'var(--text-muted, #aaa)', marginBottom: 4 }}>Actual: <span style={{ color: 'var(--text-h)', fontWeight: 600 }}>{fmtValue(tooltip.actualVal)}</span></div>
            <div style={{ fontSize: 12, fontWeight: 600, color: tooltipDiff > 0 ? '#ef4444' : '#22c55e' }}>
              {tooltipDiff >= 0 ? '+' : ''}{fmtValue(tooltipDiff)}
            </div>
            {tooltip.note && <div className="tooltip-note">{tooltip.note}</div>}
          </div>
        )}
      </div>
      <table className="sr-only">
        <caption>{year} Budgeted vs. Audited Expenditures by Category</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Budgeted</th>
            <th scope="col">Audited Actual</th>
            <th scope="col">Difference</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE_CATEGORIES.map(cat => {
            const b = budget[cat] ?? 0;
            const a = actuals[cat] ?? 0;
            const diff = a - b;
            return (
              <tr key={cat}>
                <td>{cat}</td>
                <td>{fmtValue(b)}</td>
                <td>{fmtValue(a)}</td>
                <td>{diff >= 0 ? '+' : ''}{fmtValue(diff)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompareChart;

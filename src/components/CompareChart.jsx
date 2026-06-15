import { useRef, useState } from 'react';
import { useCompareChart } from '../hooks/useCompareChart';
import { COMPARE_CATEGORIES, auditActuals, budgetMapped } from '../data/auditData';
import { fmtValue } from '../utils/format';
import './CompareChart.css';

const CompareChart = ({ year }) => {
  const [tab, setTab] = useState('category');
  const svgRef = useRef(null);
  const actuals = auditActuals[year] ?? {};
  const budget = budgetMapped[year] ?? {};

  useCompareChart({ svgRef, actuals, budget, mode: tab });

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
      <svg
        ref={svgRef}
        viewBox={tab === 'category' ? '0 0 800 500' : '0 0 800 210'}
        width="100%"
        style={{ maxWidth: 800 }}
        aria-label={`${year} budgeted vs. audited expenditures${tab === 'total' ? ' totals' : ' by category'}`}
      />
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

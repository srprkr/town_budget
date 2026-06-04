import { useRef } from 'react';
import { useTrendChart } from '../hooks/useTrendChart';
import { TREND_YEARS } from '../data/trends';
import { fmtValue } from '../utils/format';
import './TrendChart.css';

const TrendChart = ({ values, fund, type, actuals = {} }) => {
  const svgRef = useRef(null);
  useTrendChart({ svgRef, values, actuals });

  const typeLabel = type === 'revenue' ? 'Revenue' : type === 'expenditure' ? 'Expenditures' : 'Surplus / Deficit';
  const title = `${fund} — ${typeLabel}`;

  return (
    <div className="trend-wrap">
      <p className="trend-title" id="trend-chart-title">
        {fund} &mdash; {typeLabel}
      </p>
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        width="100%"
        style={{ maxWidth: 800, display: 'block' }}
        role="img"
        aria-labelledby="trend-chart-title"
      />
      <p className="trend-hint">Scroll to zoom · Drag to pan · Double-click to reset</p>
      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Planned</th>
            <th scope="col">Actual</th>
          </tr>
        </thead>
        <tbody>
          {TREND_YEARS.map((yr, i) => {
            const planned = values?.[i];
            const actual = actuals[yr];
            if (planned == null && actual == null) return null;
            return (
              <tr key={yr}>
                <td>{yr}</td>
                <td>{planned != null ? fmtValue(planned) : '—'}</td>
                <td>{actual != null ? fmtValue(actual) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TrendChart;

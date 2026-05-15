import { useRef } from 'react';
import { useTrendChart } from '../hooks/useTrendChart';
import './TrendChart.css';

const TrendChart = ({ values, fund, type, actuals = {} }) => {
  const svgRef = useRef(null);
  useTrendChart({ svgRef, values, actuals });

  return (
    <div className="trend-wrap">
      <p className="trend-title">
        {fund} &mdash; {type === 'revenue' ? 'Revenue' : type === 'expenditure' ? 'Expenditures' : 'Surplus / Deficit'}
      </p>
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        width="100%"
        style={{ maxWidth: 800, display: 'block' }}
      />
    </div>
  );
};

export default TrendChart;

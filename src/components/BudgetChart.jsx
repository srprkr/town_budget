import { useRef } from 'react';
import { useBudgetChart } from '../hooks/useBudgetChart';
import ChartTooltip from './ChartTooltip';
import ChartHint from './ChartHint';
import './BudgetChart.css';

const WIDTH = 900;
const HEIGHT = 700;

const BudgetChart = ({ data, title, drillDownData = {} }) => {
  const svgRef = useRef();
  const { breadcrumb, tooltip } = useBudgetChart({ svgRef, data, drillDownData });

  return (
    <div style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2>{title}</h2>
      <div className="chart-container">
        <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} />
        <ChartHint breadcrumb={breadcrumb} />
        <ChartTooltip tooltip={tooltip} />
      </div>
    </div>
  );
};

export default BudgetChart;

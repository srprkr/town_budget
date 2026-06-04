import { useLayoutEffect, useRef } from 'react';
import { useBudgetChart } from '../hooks/useBudgetChart';
import ChartTooltip from './ChartTooltip';
import ChartHint from './ChartHint';
import { fmtValue } from '../utils/format';
import './BudgetChart.css';

const WIDTH = 900;
const HEIGHT = 700;

const BudgetChart = ({ data, title, drillDownData, onSegmentClick, onDrillIn, onBack, backRef, source, year, noDetail }) => {
  const svgRef = useRef();
  const { breadcrumb, tooltip, triggerBack } = useBudgetChart({ svgRef, data, drillDownData, onSegmentClick, onDrillIn, onBack });
  useLayoutEffect(() => { if (backRef) backRef.current = triggerBack; });

  const titleId = 'budget-chart-title';

  return (
    <div style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 id={titleId}>{title}</h2>
      <div className="chart-container">
        <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} />
        <ChartHint breadcrumb={breadcrumb} source={source} year={year} noDetail={noDetail} />
        <ChartTooltip tooltip={tooltip} />
      </div>
      {data.length > 0 && (
        <table className="sr-only">
          <caption>{title}</caption>
          <thead>
            <tr><th scope="col">Category</th><th scope="col">Amount</th></tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td>{fmtValue(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BudgetChart;

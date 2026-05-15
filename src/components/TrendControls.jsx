import { useState } from 'react';
import { TREND_FUNDS } from '../data/trends';

const TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures'], ['balance', 'Surplus / Deficit']];
const INITIAL_VISIBLE = 5;

const TrendControls = ({ fund, type, onFundChange, onTypeChange }) => {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? TREND_FUNDS : TREND_FUNDS.slice(0, INITIAL_VISIBLE);
  const hiddenCount = TREND_FUNDS.length - INITIAL_VISIBLE;

  const handleCollapse = () => {
    setExpanded(false);
    if (fund !== 'All' && TREND_FUNDS.indexOf(fund) >= INITIAL_VISIBLE) {
      onFundChange(TREND_FUNDS[0]);
    }
  };

  return (
    <div className="controls">
      <div className="control-row">
        <span className="control-label">Fund</span>
        <div className="badges">
          <button
            className={`badge ${fund === 'All' ? 'active' : ''}`}
            onClick={() => onFundChange('All')}
          >
            All
          </button>
          {visible.map(f => (
            <button
              key={f}
              className={`badge ${fund === f ? 'active' : ''}`}
              onClick={() => onFundChange(f)}
            >
              {f}
            </button>
          ))}
          {!expanded ? (
            <button className="badge badge-more" onClick={() => setExpanded(true)}>
              Show {hiddenCount} More
            </button>
          ) : (
            <button className="badge badge-more" onClick={handleCollapse}>
              Show Less
            </button>
          )}
        </div>
      </div>
      <div className="control-row">
        <span className="control-label">Type</span>
        <div className="badges">
          {TYPES.map(([val, label]) => (
            <button
              key={val}
              className={`badge ${type === val ? 'active' : ''}`}
              onClick={() => onTypeChange(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendControls;

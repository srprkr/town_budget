import { TREND_FUNDS } from '../data/trends';

const TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures']];

const TrendControls = ({ fund, type, onFundChange, onTypeChange }) => (
  <div className="controls">
    <div className="control-row">
      <span className="control-label">Fund</span>
      <div className="badges">
        {TREND_FUNDS.map(f => (
          <button
            key={f}
            className={`badge ${fund === f ? 'active' : ''}`}
            onClick={() => onFundChange(f)}
          >
            {f}
          </button>
        ))}
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

export default TrendControls;

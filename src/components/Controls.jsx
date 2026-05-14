const YEARS = [2026, 2025, 2024];
const TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures']];

const Controls = ({ year, type, onYearChange, onTypeChange }) => (
  <div className="controls">
    <div className="control-row">
      <span className="control-label">Year</span>
      <div className="badges">
        {YEARS.map(y => (
          <button
            key={y}
            className={`badge ${year === y ? 'active' : ''}`}
            onClick={() => onYearChange(y)}
          >
            {y}
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

export default Controls;

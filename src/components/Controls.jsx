import { useState } from 'react';

const YEARS = [2026, 2025, 2024, 2023, 2022];
const TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures']];

const ToggleIcon = ({ open }) => (
  <svg className={`toggle-icon ${open ? 'is-open' : ''}`} viewBox="0 0 24 24" width="18" height="18">
    <path className="bar bar-top" d="M3 8 L21 8" />
    <path className="bar bar-bottom" d="M3 16 L21 16" />
  </svg>
);

const Controls = ({ year, type, onYearChange, onTypeChange }) => {
  const [open, setOpen] = useState(() => !window.matchMedia('(max-width: 768px)').matches);

  const summary = `${year} · ${type === 'revenue' ? 'Revenue' : 'Expenditures'}`;

  return (
    <div className="controls">
      <div className="controls-header" onClick={() => setOpen(o => !o)}>
        <span className="controls-summary">{summary}</span>
        <button
          className="controls-toggle"
          aria-label="Toggle filters"
          aria-expanded={open}
          onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        >
          <ToggleIcon open={open} />
        </button>
      </div>
      <div className={`controls-body${open ? '' : ' is-collapsed'}`}>
        <div className="controls-body-inner">
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
      </div>
    </div>
  );
};

export default Controls;

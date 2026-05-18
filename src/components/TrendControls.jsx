import { useState } from 'react';
import { TREND_FUNDS } from '../data/trends';

const TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures'], ['balance', 'Surplus / Deficit']];
const INITIAL_VISIBLE = 5;

const ToggleIcon = ({ open }) => (
  <svg className={`toggle-icon ${open ? 'is-open' : ''}`} viewBox="0 0 24 24" width="18" height="18">
    <path className="bar bar-top" d="M3 8 L21 8" />
    <path className="bar bar-bottom" d="M3 16 L21 16" />
  </svg>
);

const TYPE_LABELS = { revenue: 'Revenue', expenditure: 'Expenditures', balance: 'Surplus / Deficit' };

const TrendControls = ({ fund, type, onFundChange, onTypeChange }) => {
  const [open, setOpen] = useState(() => !window.matchMedia('(max-width: 768px)').matches);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? TREND_FUNDS : TREND_FUNDS.slice(0, INITIAL_VISIBLE);
  const hiddenCount = TREND_FUNDS.length - INITIAL_VISIBLE;
  const summary = `${fund === 'All' ? 'All Funds' : fund} · ${TYPE_LABELS[type]}`;

  const handleCollapse = () => {
    setExpanded(false);
    if (fund !== 'All' && TREND_FUNDS.indexOf(fund) >= INITIAL_VISIBLE) {
      onFundChange(TREND_FUNDS[0]);
    }
  };

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
      </div>
    </div>
  );
};

export default TrendControls;

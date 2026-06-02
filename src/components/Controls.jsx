import { useState, useRef, useEffect } from 'react';
import { TREND_FUNDS } from '../data/trends';

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
const BUDGET_TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures']];
const TREND_TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures'], ['balance', 'Surplus / Deficit']];
const SOURCES = [['borough', 'Borough'], ['school', 'School'], ['all', 'All']];
const VIEWS = [['budget', 'Budget'], ['trends', 'Trends']];
const INITIAL_VISIBLE = 5;

const TOP_CLOSED = [3, 8, 21, 8];
const TOP_OPEN   = [3, 16, 12, 8];
const BOT_CLOSED = [3, 16, 21, 16];
const BOT_OPEN   = [12, 8, 21, 16];

function lerp(a, b, t) { return a + (b - a) * t; }
function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function makePath(from, to, p) {
  return `M${lerp(from[0], to[0], p)} ${lerp(from[1], to[1], p)} L${lerp(from[2], to[2], p)} ${lerp(from[3], to[3], p)}`;
}

const ToggleIcon = ({ open }) => {
  const topRef = useRef(null);
  const botRef = useRef(null);
  const raf = useRef(null);
  const progress = useRef(open ? 1 : 0);

  useEffect(() => {
    const target = open ? 1 : 0;
    const startProg = progress.current;
    const startTime = performance.now();
    cancelAnimationFrame(raf.current);

    function tick(now) {
      const t = ease(Math.min((now - startTime) / 250, 1));
      const p = lerp(startProg, target, t);
      progress.current = p;
      topRef.current?.setAttribute('d', makePath(TOP_CLOSED, TOP_OPEN, p));
      botRef.current?.setAttribute('d', makePath(BOT_CLOSED, BOT_OPEN, p));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [open]);

  return (
    <svg className="toggle-icon" viewBox="0 0 24 24" width="18" height="18">
      <path ref={topRef} className="bar bar-top" d={makePath(TOP_CLOSED, TOP_OPEN, open ? 1 : 0)} />
      <path ref={botRef} className="bar bar-bottom" d={makePath(BOT_CLOSED, BOT_OPEN, open ? 1 : 0)} />
    </svg>
  );
};

const Controls = ({
  view, onViewChange,
  year, type, source, onYearChange, onTypeChange, onSourceChange,
  fund, onFundChange,
}) => {
  const [open, setOpen] = useState(() => !window.matchMedia('(max-width: 768px)').matches);
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? TREND_FUNDS : TREND_FUNDS.slice(0, INITIAL_VISIBLE);
  const hiddenCount = TREND_FUNDS.length - INITIAL_VISIBLE;

  const handleCollapse = () => {
    setExpanded(false);
    if (fund !== 'All' && TREND_FUNDS.indexOf(fund) >= INITIAL_VISIBLE) {
      onFundChange(TREND_FUNDS[0]);
    }
  };

  const handleViewChange = (val) => {
    onViewChange(val);
    if (val === 'budget' && type === 'balance') onTypeChange('expenditure');
  };

  return (
    <div className="controls">
      <div className="controls-header" onClick={() => setOpen(o => !o)}>
        <span className="controls-summary">Filters</span>
        <div className="badges" onClick={e => e.stopPropagation()}>
          {VIEWS.map(([val, label]) => (
            <button
              key={val}
              className={`badge ${view === val ? 'active' : ''}`}
              onClick={() => handleViewChange(val)}
            >
              {label}
            </button>
          ))}
        </div>
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

          {view === 'budget' ? (
            <>
              <div className="control-row">
                <span className="control-label">Source</span>
                <div className="badges">
                  {SOURCES.map(([val, label]) => (
                    <button
                      key={val}
                      className={`badge ${source === val ? 'active' : ''}`}
                      onClick={() => onSourceChange(val)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
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
                  {BUDGET_TYPES.map(([val, label]) => (
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
            </>
          ) : (
            <>
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
                  {TREND_TYPES.map(([val, label]) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;

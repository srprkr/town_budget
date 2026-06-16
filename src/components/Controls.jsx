import { useState, useRef, useEffect } from 'react';
import { TREND_FUNDS } from '../data/trends';
import { AUDIT_YEARS } from '../data/auditData';

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];
const BUDGET_TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures']];
const TREND_TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures'], ['balance', 'Surplus / Deficit']];
const SOURCES = [['borough', 'Borough'], ['school', 'School'], ['all', 'All']];
const INITIAL_VISIBLE = 8;

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
  dataMode, onDataModeChange,
}) => {
  const [open, setOpen] = useState(() => !window.matchMedia('(max-width: 768px)').matches);
  const [expanded, setExpanded] = useState(false);
  const [yearsExpanded, setYearsExpanded] = useState(false);

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
          <button
            className={`badge icon-badge ${view === 'budget' ? 'active' : ''}`}
            onClick={() => handleViewChange('budget')}
            aria-label="Budget view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" width="15" height="15" aria-hidden="true">
              <path fill="currentColor" d="M0 7.49996C0 3.52583 3.09098 0.27365 7 0.0163574V4.0354C5.30385 4.27801 4 5.73672 4 7.49996C4 9.43295 5.567 11 7.5 11C8.28618 11 9.01181 10.7407 9.5961 10.3031L12.438 13.1451C11.1188 14.3 9.39113 15 7.5 15C3.35786 15 0 11.6421 0 7.49996Z"/>
              <path fill="currentColor" d="M13.1451 12.438C14.3001 11.1187 15 9.39107 15 7.49996C15 6.46644 14.7909 5.48175 14.4128 4.58586L10.7552 6.21147C10.9132 6.61024 11 7.04496 11 7.49996C11 8.28611 10.7408 9.01174 10.3032 9.59602L13.1451 12.438Z"/>
              <path fill="currentColor" d="M8 4.0354V0.0163574C10.5416 0.183645 12.7373 1.61699 13.9626 3.69166L10.2541 5.33986C9.71063 4.64791 8.91203 4.16585 8 4.0354Z"/>
            </svg>
          </button>
          <button
            className={`badge icon-badge ${view === 'trends' ? 'active' : ''}`}
            onClick={() => handleViewChange('trends')}
            aria-label="Trends view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" aria-hidden="true">
              <polyline points="224 208 32 208 32 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
              <polyline points="224 96 160 152 96 104 32 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
            </svg>
          </button>
          <button
            className={`badge icon-badge ${view === 'compare' ? 'active' : ''}`}
            onClick={() => handleViewChange('compare')}
            aria-label="Compare view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" aria-hidden="true">
              <line x1="40" y1="208" x2="216" y2="208" stroke="currentColor" strokeLinecap="round" strokeWidth="20"/>
              <line x1="40" y1="40" x2="40" y2="208" stroke="currentColor" strokeLinecap="round" strokeWidth="20"/>
              <rect x="60" y="128" width="30" height="80" rx="3" fill="currentColor"/>
              <rect x="96" y="80" width="30" height="128" rx="3" fill="currentColor"/>
              <rect x="150" y="152" width="30" height="56" rx="3" fill="currentColor"/>
              <rect x="186" y="104" width="30" height="104" rx="3" fill="currentColor"/>
            </svg>
          </button>
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
                <span className="control-label">Data</span>
                <div className="badges">
                  <button
                    className={`badge ${dataMode === 'budget' ? 'active' : ''}`}
                    onClick={() => onDataModeChange('budget')}
                  >
                    Budget
                  </button>
                  <button
                    className={`badge ${dataMode === 'actual' ? 'active' : ''}`}
                    onClick={() => onDataModeChange('actual')}
                  >
                    Actual
                  </button>
                </div>
              </div>
              {dataMode === 'budget' && (
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
              )}
              <div className="control-row">
                <span className="control-label">Year</span>
                <div className="badges">
                  {(dataMode === 'actual'
                    ? (yearsExpanded ? AUDIT_YEARS : AUDIT_YEARS.slice(0, INITIAL_VISIBLE))
                    : YEARS
                  ).map(y => (
                    <button
                      key={y}
                      className={`badge ${year === y ? 'active' : ''}`}
                      onClick={() => onYearChange(y)}
                    >
                      {y}
                    </button>
                  ))}
                  {dataMode === 'actual' && (!yearsExpanded ? (
                    <button className="badge badge-more" onClick={() => setYearsExpanded(true)}>
                      Show {AUDIT_YEARS.length - INITIAL_VISIBLE} More
                    </button>
                  ) : (
                    <button className="badge badge-more" onClick={() => {
                      setYearsExpanded(false);
                      if (AUDIT_YEARS.indexOf(year) >= INITIAL_VISIBLE) onYearChange(AUDIT_YEARS[0]);
                    }}>
                      Show Less
                    </button>
                  ))}
                </div>
              </div>
              {dataMode === 'budget' && (
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
              )}
            </>
          ) : view === 'compare' ? (
            <div className="control-row">
              <span className="control-label">Year</span>
              <div className="badges">
                {(yearsExpanded ? AUDIT_YEARS : AUDIT_YEARS.slice(0, INITIAL_VISIBLE)).map(y => (
                  <button
                    key={y}
                    className={`badge ${year === y ? 'active' : ''}`}
                    onClick={() => onYearChange(y)}
                  >
                    {y}
                  </button>
                ))}
                {!yearsExpanded ? (
                  <button className="badge badge-more" onClick={() => setYearsExpanded(true)}>
                    Show {AUDIT_YEARS.length - INITIAL_VISIBLE} More
                  </button>
                ) : (
                  <button className="badge badge-more" onClick={() => {
                    setYearsExpanded(false);
                    if (AUDIT_YEARS.indexOf(year) >= INITIAL_VISIBLE) onYearChange(AUDIT_YEARS[0]);
                  }}>
                    Show Less
                  </button>
                )}
              </div>
            </div>
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

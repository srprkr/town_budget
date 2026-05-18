import { useState, useRef, useEffect } from 'react';

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const TYPES = [['revenue', 'Revenue'], ['expenditure', 'Expenditures']];

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

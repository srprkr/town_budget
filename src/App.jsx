import { useState } from 'react';
import BudgetChart from './components/BudgetChart';
import TrendChart from './components/TrendChart';
import Controls from './components/Controls';
import TrendControls from './components/TrendControls';
import { budgets, drillDown, schoolBudgets } from './data';
import { trends, TREND_FUNDS, TREND_YEARS, actuals as trendActuals } from './data/trends';
import { useTheme } from './hooks/useTheme';
import './App.css';

const VIEWS = [['budget', 'Budget'], ['trends', 'Trends']];

function App() {
  const [year, setYear] = useState(2026);
  const [type, setType] = useState('revenue');
  const [view, setView] = useState('budget');
  const [fund, setFund] = useState('General Fund');
  const [source, setSource] = useState('borough');
  const { theme, toggle } = useTheme();

  let trendValues, fundActuals;
  if (type === 'balance') {
    if (fund === 'All') {
      trendValues = TREND_YEARS.map((_, i) => {
        const hasData = TREND_FUNDS.some(f => trends.revenue[f][i] != null);
        if (!hasData) return null;
        return TREND_FUNDS.reduce((s, f) => s + (trends.revenue[f][i] ?? 0) - (trends.expenditure[f][i] ?? 0), 0);
      });
      fundActuals = TREND_YEARS.reduce((out, yr) => {
        const hasRev = TREND_FUNDS.some(f => trendActuals.revenue[f]?.[yr] != null);
        if (!hasRev) return out;
        out[yr] = TREND_FUNDS.reduce((s, f) =>
          s + (trendActuals.revenue[f]?.[yr] ?? 0) - (trendActuals.expenditure[f]?.[yr] ?? 0), 0);
        return out;
      }, {});
    } else {
      trendValues = TREND_YEARS.map((_, i) => {
        const r = trends.revenue[fund][i], e = trends.expenditure[fund][i];
        return (r != null && e != null) ? r - e : null;
      });
      fundActuals = {};
      TREND_YEARS.forEach(yr => {
        const r = trendActuals.revenue[fund]?.[yr], e = trendActuals.expenditure[fund]?.[yr];
        if (r != null && e != null) fundActuals[yr] = r - e;
      });
    }
  } else {
    trendValues = fund === 'All'
      ? TREND_YEARS.map((_, i) => TREND_FUNDS.reduce((sum, f) => sum + (trends[type][f][i] ?? 0), 0))
      : trends[type][fund];
    fundActuals = fund === 'All'
      ? TREND_YEARS.reduce((out, yr) => {
          const total = TREND_FUNDS.reduce((s, f) => s + (trendActuals[type][f]?.[yr] ?? 0), 0);
          if (total) out[yr] = total;
          return out;
        }, {})
      : (trendActuals[type][fund] ?? {});
  }

  const schoolItems = source === 'all' ? (schoolBudgets[year]?.[type] ?? []) : [];
  const schoolTotal = schoolItems.reduce((s, d) => s + d.value, 0);
  const chartData =
    source === 'borough' ? budgets[year][type]
    : source === 'school' ? (schoolBudgets[year]?.[type] ?? [])
    : [...budgets[year][type], ...(schoolTotal > 0 ? [{ name: 'Jenkintown School District', value: schoolTotal }] : [])];
  const chartDrillDown =
    source === 'borough' ? drillDown[year][type]
    : source === 'all' && schoolTotal > 0
      ? { ...drillDown[year][type], 'Jenkintown School District': schoolItems }
      : source === 'all' ? drillDown[year][type]
      : undefined;

  return (
    <div className="app">
      <header>
        <div className="header-title">
          <h1>Jenkintown Borough Budget</h1>
          <button className={`theme-toggle ${theme === 'dark' ? 'is-dark' : 'is-light'}`} onClick={toggle} aria-label="Toggle theme">
            <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </button>
        </div>
        <div className="view-nav">
          {VIEWS.map(([val, label]) => (
            <button
              key={val}
              className={`badge ${view === val ? 'active' : ''}`}
              onClick={() => { setView(val); if (val === 'budget' && type === 'balance') setType('expenditure'); }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      {view === 'budget'
        ? <Controls year={year} type={type} source={source} onYearChange={setYear} onTypeChange={setType} onSourceChange={setSource} />
        : <TrendControls fund={fund} type={type} onFundChange={setFund} onTypeChange={setType} />
      }
      <main>
        {view === 'budget' ? (
          <BudgetChart
            data={chartData}
            title={
              source === 'school'
                ? `${year - 1}–${String(year).slice(2)} School District Planned ${type === 'revenue' ? 'Revenue' : 'Expenditures'}`
                : source === 'all'
                  ? `${year} Combined Borough & School Planned ${type === 'revenue' ? 'Revenue' : 'Expenditures'}`
                  : `${year} Planned ${type === 'revenue' ? 'Revenue' : 'Expenditures'} by Fund`
            }
            drillDownData={chartDrillDown}
          />
        ) : (
          <TrendChart
            key={`${fund}-${type}`}
            values={trendValues}
            fund={fund === 'All' ? 'All Funds' : fund}
            type={type}
            actuals={fundActuals}
          />
        )}
      </main>
    </div>
  );
}

export default App;

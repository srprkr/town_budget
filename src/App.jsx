import { useState, useRef } from 'react';
import BudgetChart from './components/BudgetChart';
import TrendChart from './components/TrendChart';
import CompareChart from './components/CompareChart';
import Controls from './components/Controls';
import Disclaimer from './components/Disclaimer';
import ContactForm from './components/ContactForm';
import { budgets, drillDown, schoolBudgets } from './data';
import { useTheme } from './hooks/useTheme';
import { useTrendData } from './hooks/useTrendData';
import { AUDIT_YEARS, COMPARE_CATEGORIES, auditActuals } from './data/auditData';
import { auditDrilldown } from './data/auditDrilldown';
import './App.css';

function App() {
  const [year, setYear] = useState(2026);
  const [type, setType] = useState('revenue');
  const [view, setView] = useState('budget');
  const [fund, setFund] = useState('General Fund');
  const [source, setSource] = useState('borough');
  const { theme, toggle } = useTheme();
  const [drilledFromAll, setDrilledFromAll] = useState(false);
  const [dataMode, setDataMode] = useState('budget');
  const chartBackRef = useRef(null);

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'compare' && !AUDIT_YEARS.includes(year)) {
      setYear(AUDIT_YEARS[0]);
    }
  };

  const handleDataModeChange = (mode) => {
    setDataMode(mode);
    if (mode === 'actual' && !AUDIT_YEARS.includes(year)) {
      setYear(AUDIT_YEARS[0]);
    }
  };

  const handleSourceChange = (newSource) => {
    if (newSource === 'all' && drilledFromAll && chartBackRef.current) {
      chartBackRef.current();
      return;
    }
    setDrilledFromAll(false);
    setSource(newSource);
  };

  const { trendValues, fundActuals } = useTrendData(fund, type);

  const hasBoroughData = !!budgets[year];
  const hasSchoolData = !!schoolBudgets[year];

  const schoolItems = source === 'all' ? (schoolBudgets[year]?.[type] ?? []) : [];
  const schoolTotal = schoolItems.reduce((s, d) => s + d.value, 0);
  const boroughTotal = source === 'all' ? (budgets[year]?.[type] ?? []).reduce((s, d) => s + d.value, 0) : 0;

  const chartData =
    source === 'borough' ? (budgets[year]?.[type] ?? [])
    : source === 'school' ? (schoolBudgets[year]?.[type] ?? [])
    : [
        { name: 'Borough of Jenkintown', value: boroughTotal },
        ...(schoolTotal > 0 ? [{ name: 'Jenkintown School District', value: schoolTotal }] : []),
      ];

  const chartDrillDown =
    source === 'all'
      ? {
          'Borough of Jenkintown': budgets[year]?.[type] ?? [],
          ...(schoolTotal > 0 ? { 'Jenkintown School District': schoolBudgets[year]?.[type] ?? [] } : {}),
        }
      : source === 'borough'
        ? drillDown[year]?.[type]
        : undefined;

  const onDrillIn = source === 'all' ? (name) => {
    setDrilledFromAll(true);
    if (name === 'Borough of Jenkintown') setSource('borough');
    else if (name === 'Jenkintown School District') setSource('school');
  } : undefined;

  const onBack = drilledFromAll ? () => {
    setDrilledFromAll(false);
    setSource('all');
  } : undefined;

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
      </header>
      {view !== 'disclaimer' && view !== 'contact' && (
        <Controls
          view={view} onViewChange={handleViewChange}
          year={year} type={type} source={source}
          onYearChange={setYear} onTypeChange={setType} onSourceChange={handleSourceChange}
          fund={fund} onFundChange={setFund}
          dataMode={dataMode} onDataModeChange={handleDataModeChange}
        />
      )}
      <main className={view === 'disclaimer' || view === 'contact' ? 'page-main' : ''}>
        {view === 'disclaimer' ? (
          <Disclaimer
            onContact={() => setView('contact')}
            onBack={() => setView('budget')}
          />
        ) : view === 'contact' ? (
          <ContactForm onBack={() => setView('budget')} />
        ) : view === 'budget' && dataMode === 'actual' ? (
          <BudgetChart
            data={COMPARE_CATEGORIES.map(cat => ({ name: cat, value: auditActuals[year]?.[cat] ?? 0 }))}
            title={`${year} Audited Actual Expenditures`}
            drillDownData={auditDrilldown[year]}
            source="actual"
            year={year}
            hintLine={auditDrilldown[year] ? undefined : 'Scroll to zoom · Double-click to reset zoom'}
          />
        ) : view === 'budget' && source === 'school' && !hasSchoolData ? (
          <p className="no-data-message">No school budget data available for {year}.</p>
        ) : view === 'budget' && source !== 'school' && !hasBoroughData ? (
          <p className="no-data-message">No borough budget data available for {year}.</p>
        ) : view === 'compare' ? (
          <CompareChart key={year} year={year} />
        ) : view === 'budget' ? (
          <BudgetChart
            data={chartData}
            noDetail={year === 2016}
            title={
              source === 'school'
                ? `${year - 1}–${String(year).slice(2)} School District Planned ${type === 'revenue' ? 'Revenue' : 'Expenditures'}`
                : source === 'all'
                  ? `${year} Combined Borough & School Planned ${type === 'revenue' ? 'Revenue' : 'Expenditures'}`
                  : `${year} Planned ${type === 'revenue' ? 'Revenue' : 'Expenditures'} by Fund`
            }
            drillDownData={chartDrillDown}
            onDrillIn={onDrillIn}
            onBack={onBack}
            backRef={chartBackRef}
            source={source}
            year={year}
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
      <footer>
        <button className="footer-link" onClick={() => setView('disclaimer')}>Disclaimer</button>
        <span className="footer-sep">·</span>
        <button className="footer-link" onClick={() => setView('contact')}>Report a Discrepancy</button>
      </footer>
    </div>
  );
}

export default App;

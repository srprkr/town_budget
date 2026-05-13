import { useState } from 'react';
import BudgetChart from './components/BudgetChart';
import Controls from './components/Controls';
import { budgets, drillDown } from './data';
import { useTheme } from './hooks/useTheme';
import './App.css';

function App() {
  const [year, setYear] = useState(2026);
  const [type, setType] = useState('revenue');
  const { theme, toggle } = useTheme();

  return (
    <div className="app">
      <header>
        <h1>Jenkintown Borough Budget</h1>
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>
      <Controls year={year} type={type} onYearChange={setYear} onTypeChange={setType} />
      <main>
        <BudgetChart
          key={`${year}-${type}`}
          data={budgets[year][type]}
          title={`${year} ${type === 'revenue' ? 'Revenue' : 'Expenditures'} by Fund`}
          drillDownData={drillDown[year][type]}
        />
      </main>
    </div>
  );
}

export default App;

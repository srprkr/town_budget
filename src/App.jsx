import { useState } from 'react';
import BudgetChart from './components/BudgetChart';
import Controls from './components/Controls';
import { budgets, drillDown } from './data';
import './App.css';

function App() {
  const [year, setYear] = useState(2026);
  const [type, setType] = useState('revenue');

  return (
    <div className="app">
      <header>
        <h1>Jenkintown Borough Budget</h1>
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

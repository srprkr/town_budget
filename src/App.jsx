import { useState } from 'react'
import BudgetChart from './components/BudgetChart'
import { budget2026, generalFundBreakdown as generalFundBreakdown2026 } from './data/budget2026'
import {
  budget2025,
  generalFundBreakdown,
  capitalProjectsBreakdown,
  sewerFundBreakdown,
  solidWasteBreakdown,
  debtServiceBreakdown,
  streetTaxBreakdown,
  stateLiquidFuelsBreakdown,
  policePensionBreakdown,
  nonUniformedPensionBreakdown,
  fireProtectionBreakdown,
  fireApparatusBreakdown,
  streetLightingBreakdown,
} from './data/budget2025'
import './App.css'

const budgets = {
  2025: budget2025,
  2026: budget2026,
};

const drillDown = {
  2025: {
    revenue: {
      'General Fund': generalFundBreakdown.revenue,
      'Capital Projects Fund': capitalProjectsBreakdown.revenue,
      'Sewer Fund': sewerFundBreakdown.revenue,
      'Solid Waste Fund': solidWasteBreakdown.revenue,
      'Debt Service Fund': debtServiceBreakdown.revenue,
      'Street Tax Fund': streetTaxBreakdown.revenue,
      'State Liquid Fuels Fund': stateLiquidFuelsBreakdown.revenue,
      'Police Pension Fund': policePensionBreakdown.revenue,
      'Non-Uniformed Pension Fund': nonUniformedPensionBreakdown.revenue,
      'Fire Protection Fund': fireProtectionBreakdown.revenue,
      'Fire Apparatus Fund': fireApparatusBreakdown.revenue,
      'Street Lighting Tax Fund': streetLightingBreakdown.revenue,
    },
    expenditure: {
      'General Fund': generalFundBreakdown.expenditure,
      'Capital Projects Fund': capitalProjectsBreakdown.expenditure,
      'Sewer Fund': sewerFundBreakdown.expenditure,
      'Solid Waste Fund': solidWasteBreakdown.expenditure,
      'Debt Service Fund': debtServiceBreakdown.expenditure,
      'Street Tax Fund': streetTaxBreakdown.expenditure,
      'State Liquid Fuels Fund': stateLiquidFuelsBreakdown.expenditure,
      'Police Pension Fund': policePensionBreakdown.expenditure,
      'Non-Uniformed Pension Fund': nonUniformedPensionBreakdown.expenditure,
      'Fire Protection Fund': fireProtectionBreakdown.expenditure,
      'Fire Apparatus Fund': fireApparatusBreakdown.expenditure,
      'Street Lighting Tax Fund': streetLightingBreakdown.expenditure,
    },
  },
  2026: {
    revenue: { 'General Fund': generalFundBreakdown2026.revenue },
    expenditure: { 'General Fund': generalFundBreakdown2026.expenditure },
  },
};

function App() {
  const [year, setYear] = useState(2026)
  const [type, setType] = useState('revenue')

  const data = budgets[year][type];
  const drillDownData = drillDown[year][type];
  const title = `${year} ${type === 'revenue' ? 'Revenue' : 'Expenditures'} by Fund`;

  return (
    <div className="app">
      <header>
        <h1>Jenkintown Borough Budget</h1>
      </header>

      <div className="controls">
        <div className="control-row">
          <span className="control-label">Year</span>
          <div className="badges">
            {[2026, 2025].map(y => (
              <button
                key={y}
                className={`badge ${year === y ? 'active' : ''}`}
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        <div className="control-row">
          <span className="control-label">Type</span>
          <div className="badges">
            {[['revenue', 'Revenue'], ['expenditure', 'Expenditures']].map(([val, label]) => (
              <button
                key={val}
                className={`badge ${type === val ? 'active' : ''}`}
                onClick={() => setType(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main>
        <BudgetChart
          key={`${year}-${type}`}
          data={data}
          title={title}
          drillDownData={drillDownData}
        />
      </main>
    </div>
  )
}

export default App

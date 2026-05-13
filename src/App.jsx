import { useState } from 'react'
import BudgetChart from './components/BudgetChart'
import { budget2026 } from './data/budget2026'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('revenue')
  const [drilledSegment, setDrilledSegment] = useState(null)

  const handleSegmentClick = (segment) => {
    if (segment.name === 'General Fund') {
      setDrilledSegment(segment)
      // V2: Will implement drill-down chart here
      console.log('Drilling down into:', segment)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Jenkintown Borough 2026 Budget</h1>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('revenue')
            setDrilledSegment(null)
          }}
        >
          Revenue
        </button>
        <button
          className={`tab ${activeTab === 'expenditure' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('expenditure')
            setDrilledSegment(null)
          }}
        >
          Expenditures
        </button>
      </div>

      <main>
        {activeTab === 'revenue' && (
          <BudgetChart
            data={budget2026.revenue}
            title="Revenue by Fund"
            onSegmentClick={handleSegmentClick}
          />
        )}
        {activeTab === 'expenditure' && (
          <BudgetChart
            data={budget2026.expenditure}
            title="Expenditures by Fund"
            onSegmentClick={handleSegmentClick}
          />
        )}
      </main>
    </div>
  )
}

export default App

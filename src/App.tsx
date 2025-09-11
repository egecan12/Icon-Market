import Dashboard from './components/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'
import ErrorNotification from './components/ErrorNotification'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <div className="app-container">
        <header>
          <h1>Iconflix</h1>
        </header>
        <ErrorNotification />
        <Dashboard />
      </div>
    </ErrorBoundary>
  )
}

export default App

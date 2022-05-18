import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './shared/store'
import reportWebVitals from './reportWebVitals'
import './index.css'
import { Counter } from './features/canvas/Counter'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Counter />
        <span></span>
      </header>
    </div>
  )
}

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

reportWebVitals()

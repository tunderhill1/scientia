import React, { useContext } from 'react'
import logo from '../logo.svg'
import '../styles/_app.css'
import { globalStyles } from '../styles/stitches.config'
import ThemeProvider, { ThemeContext } from '../lib/ThemeProvider'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <button onClick={toggleTheme}>Mode: {theme}</button>
}

function App() {
  globalStyles()
  return (
    <ThemeProvider>
      <div className="App">
        {/* Testing out grid functionality */}
        <r-grid columns="4">
          <r-cell>Scientia</r-cell>
          <r-cell>Scientia</r-cell>
          <r-cell>Scientia</r-cell>
          <r-cell>Scientia</r-cell>
        </r-grid>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          <ToggleTheme />
        </header>
      </div>
    </ThemeProvider>
  )
}

export default App

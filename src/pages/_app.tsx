import React from 'react'
import { globalStyles } from '../styles/stitches.config'
import ThemeProvider from '../lib/ThemeProvider'
import { Routes, Route } from 'react-router-dom'
import Modules from './Modules'

function App() {
  globalStyles()
  return (
    <ThemeProvider>
      {/* TODO: Add a no-match route (i.e. 404 Not Found) */}
      <Routes>
        <Route path="/" element={<Modules />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App

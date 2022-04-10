import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { ThemeProvider } from '../lib/theme.context'
import { UserProvider } from '../lib/user.context'
import { globalStyles } from '../styles/stitches.config'
import Login from './Login'
import Modules from './Modules'

function App() {
  globalStyles()
  return (
    <ThemeProvider>
      <UserProvider>
        {/* TODO: Add a no-match route (i.e. 404 Not Found) */}
        <Routes>
          <Route index element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="modules" element={<Modules />} />
          </Route>
        </Routes>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App

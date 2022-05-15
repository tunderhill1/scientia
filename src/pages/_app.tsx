import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { baseURL } from '../constants/endpoints'
import { AxiosInstanceProvider } from '../lib/axios.context'
import { ThemeProvider } from '../lib/theme.context'
import { UserProvider } from '../lib/user.context'
import { globalStyles } from '../styles/stitches.config'
import { Area, Scrollbar, Thumb, Viewport } from '../styles/_app.style'
import Login from './Login'
import Module from './Module'
import Exercises from './Exercises'
import Materials from './Materials'
import Modules from './Modules'

function App() {
  globalStyles()
  return (
    <ThemeProvider>
      <UserProvider>
        <AxiosInstanceProvider config={{ baseURL: baseURL }}>
          <Area>
            <Viewport>
              {/* TODO: Add a no-match route (i.e. 404 Not Found) */}
              <Routes>
                <Route index element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="modules">
                    <Route index element={<Modules />} />
                    <Route path=":moduleCode" element={<Module />}>
                      {/* TODO: Replace with the overview page afer Scientia backend is up and ready */}
                      <Route index element={<Navigate to="materials" />} />
                      <Route path="materials" element={<Materials />} />
                      <Route path="exercises" element={<Exercises />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </Viewport>
            <Scrollbar orientation="vertical">
              <Thumb />
            </Scrollbar>
          </Area>
        </AxiosInstanceProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App

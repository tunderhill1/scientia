import React, { useContext } from 'react'
import { Container, Logo, Button } from '../styles/_app.style'
import { globalStyles } from '../styles/stitches.config'
import ThemeProvider, { ThemeContext } from '../lib/ThemeProvider'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

function App() {
  globalStyles()
  return (
    <ThemeProvider>
      <Container>
        <Logo src="assets/logo.svg" alt="logo" />
        <r-grid columns="2">
          <r-cell>The Scientia Project</r-cell>
          <r-cell>
            <ToggleTheme />
          </r-cell>
        </r-grid>
      </Container>
    </ThemeProvider>
  )
}

export default App

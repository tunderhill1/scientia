import { useContext } from 'react'
import { ThemeContext } from '../lib/ThemeProvider'
import { Button, Container, Logo } from '../styles/_app.style'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

const Modules = () => {
  return (
    <Container>
      <Logo src="assets/logo.svg" alt="logo" />
      <r-grid columns="2">
        <r-cell>The Scientia Project</r-cell>
        <r-cell>
          <ToggleTheme />
        </r-cell>
      </r-grid>
    </Container>
  )
}

export default Modules

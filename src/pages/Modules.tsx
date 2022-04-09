import { useContext } from 'react'
import useAuth from '../lib/auth.service'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { Button, Container, Logo } from '../styles/_app.style'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

const Modules = () => {
  const { loginUser } = useAuth()
  const { username } = useUser()
  return (
    <Container>
      <Logo src="assets/logo.svg" alt="logo" />
      <r-grid columns="2">
        <r-cell>
          <p>The Scientia Project</p>
          <i>{username ? username : 'Not logged in'}</i>
        </r-cell>
        <r-cell>
          <ToggleTheme />
          <Button
            onClick={() => {
              loginUser({ username: 'br819', password: 'abc' })
            }}
          >
            Login
          </Button>
        </r-cell>
      </r-grid>
    </Container>
  )
}

export default Modules

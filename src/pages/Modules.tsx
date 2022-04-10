import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../lib/auth.service'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { Button, Container, Logo } from '../styles/_app.style'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

const Modules = () => {
  const { logoutUser } = useAuth()
  const { username } = useUser()
  const navigate = useNavigate()
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
              logoutUser()
              navigate('/')
            }}
          >
            Logout
          </Button>
        </r-cell>
      </r-grid>
    </Container>
  )
}

export default Modules

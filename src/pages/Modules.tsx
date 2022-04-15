import { useContext } from 'react'
import useAuth from '../lib/auth.service'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { Button, Container, Logo } from '../styles/_app.style'
import Avatar from 'boring-avatars'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

const Modules = () => {
  const { logoutUser } = useAuth()
  const { username } = useUser()
  return (
    <Container>
      <Logo src="assets/logo.svg" alt="logo" />
      <r-grid columns="2">
        <r-cell style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p>The Scientia Project</p>
          <i>{username}</i>
          <Avatar
            size={128}
            name={username}
            variant="marble"
            colors={['#264653', '#2A9d8F', '#E9C46A', '#F4A261', '#E76F51']}
          />
        </r-cell>
        <r-cell style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ToggleTheme />
          <Button
            onClick={() => {
              logoutUser()
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

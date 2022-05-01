import { useContext } from 'react'
import useAuth from '../lib/auth.service'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { Button, Container, Logo } from '../styles/_app.style'
import Avatar from 'boring-avatars'
import { useAxios } from '../lib/axios.context'
import { endpoints } from '../constants/endpoints'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

const Modules = () => {
  const { logoutUser } = useAuth()
  const { username } = useUser()
  const { data } = useAxios(endpoints.courses('2021'), 'GET')

  return (
    <Container>
      <Logo src="assets/logo.svg" alt="logo" />
      <r-grid columns="6">
        <r-cell span="3" span-s="row">
          <p>The Scientia Project</p>
          <i>{username}</i>
          <Avatar
            size={128}
            name={username}
            variant="marble"
            colors={['#264653', '#2A9d8F', '#E9C46A', '#F4A261', '#E76F51']}
          />
        </r-cell>
        <r-cell span="4-6" span-s="row">
          <ToggleTheme />
          <Button
            onClick={() => {
              logoutUser()
            }}
          >
            Logout
          </Button>
          {data && (
            <ul>
              {data.map((module: any) => (
                <li key={module.title}>{module.title}</li>
              ))}
            </ul>
          )}
        </r-cell>
      </r-grid>
    </Container>
  )
}

export default Modules

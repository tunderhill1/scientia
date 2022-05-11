import { useContext, useEffect, useState } from 'react'
import { Check } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import useAuth from '../lib/auth.service'
import { ThemeContext } from '../lib/theme.context'
import { Checkbox, Fieldset, Form, Indicator, Input, Label, Logo, Name, Tagline } from '../styles/login.style'
import { Button, Container } from '../styles/_app.style'

/* TODO: Add a help toggle to the login form (i.e. information for new users to the platform) */
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const { loginUser, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { theme } = useContext(ThemeContext)

  /* TODO: Update the login user to take in the remember preference; only store the refresh token if it's checked. */
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('submitting...')
    e.preventDefault()
    /* Login and if successful, redirect to the modules page */
    await loginUser({ username: username, password: password }).then(() => {
      if (isLoggedIn()) navigate('/modules', { replace: true })
    })
  }

  useEffect(() => {
    /* Navigate to /modules if the user's already logged in */
    if (isLoggedIn()) navigate('/modules', { replace: true })
  }, [isLoggedIn, navigate])

  return (
    <Container center expand dotted css={{ paddingTop: '0' }}>
      <Form onSubmit={handleSubmit}>
        <Logo alt="Scientia logo" src="assets/logo.svg" style={{ filter: `invert(${theme === 'dark' ? 1 : 0})` }} />
        <Name style={{ margin: 0 }}>Scientia</Name>
        <Tagline style={{ marginBottom: '2rem' }}>A Unified DoC EdTech Platform</Tagline>

        <Fieldset>
          <Label htmlFor="Username">Username</Label>
          <Input
            name="Username"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Fieldset>

        <Fieldset>
          <Label htmlFor="Password">Password</Label>
          <Input
            name="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Fieldset>

        <Fieldset horizontal>
          <Checkbox onCheckedChange={(checked) => setRemember(checked === 'indeterminate' ? false : checked)}>
            <Indicator>
              <Check />
            </Indicator>
          </Checkbox>
          <p>Remember me</p>
        </Fieldset>
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  )
}

export default Login

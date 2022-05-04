import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../lib/auth.service'
import { Button, Container } from '../styles/_app.style'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser, isLoggedIn } = useAuth()
  const navigate = useNavigate()

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
    <Container css={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', height: '100%' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <label htmlFor="Username">Username</label>
          <input
            name="Username"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="Password">Password</label>
          <input
            name="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </Container>
  )
}

export default Login

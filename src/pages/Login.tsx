import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../lib/auth.service'
import { Button, Container } from '../styles/_app.style'

const Login = () => {
  const { loginUser, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    /* Navigate to /modules if the user's already logged in */
    if (isLoggedIn()) navigate('/modules', { replace: true })
  }, [isLoggedIn, navigate])

  return (
    <Container>
      <Button
        onClick={async () => {
          /* Login and if successful, redirect to the modules page */
          await loginUser({ username: 'br819', password: 'abc' }).then(() => {
            if (isLoggedIn()) navigate('/modules', { replace: true })
          })
        }}
      >
        Login
      </Button>
    </Container>
  )
}

export default Login

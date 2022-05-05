import Avatar from 'boring-avatars'
import { useContext } from 'react'
import { Command, Search } from 'react-bootstrap-icons'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../lib/auth.service'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { Header, Logo, Nav } from '../styles/_app.style'

/**
 * A protected route checks if a user is logged in before allowing a route to succeed. If not, they're
 * redirected to page at the redirect path (login by default).
 *
 * TODO: Wrap header and possibly footer components around the outlet. Else create a separate layout component that
 * would add the header and footer with an option to disable it for certain pages.
 */
export const ProtectedRoute = ({ redirectPath = '/' }) => {
  const { isLoggedIn } = useAuth()
  const { username } = useUser()
  const { theme } = useContext(ThemeContext)

  return isLoggedIn() ? (
    <>
      {/* TODO: Extract this header into the components folder as Navigation */}
      <Header>
        <Nav>
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            {/* TODO: We might need to store logos separately if they're theme-configurable */}
            <Logo alt="Scientia logo" src="assets/logo.svg" style={{ filter: `invert(${theme === 'dark' ? 1 : 0})` }} />
            <span style={{ marginLeft: '0.5rem', fontSize: 'x-large', fontWeight: 600 }}>Scientia</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Search size={22} style={{ marginRight: '2rem' }} />
            <Command size={22} style={{ marginRight: '2rem' }} />
            <Avatar
              size={32}
              name={username}
              variant="marble"
              colors={['#264653', '#2A9d8F', '#E9C46A', '#F4A261', '#E76F51']}
            />
          </div>
        </Nav>
      </Header>
      <Outlet />
    </>
  ) : (
    <Navigate to={redirectPath} replace />
  )
}

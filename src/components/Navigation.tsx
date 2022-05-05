import Avatar from 'boring-avatars'
import { useContext } from 'react'
import { Command, Search } from 'react-bootstrap-icons'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { Header, Nav, Logo } from '../styles/navigation.style'

/**
 * TODO: Extract the colours as a constant and implement functionality for the buttons!
 */
export const Navigation = () => {
  const { username } = useUser()
  const { theme } = useContext(ThemeContext)

  return (
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
  )
}

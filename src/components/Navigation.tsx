import Avatar from 'boring-avatars'
import { useContext } from 'react'
import { Command, DoorClosedFill, MoonFill, Search, SunFill } from 'react-bootstrap-icons'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { Content, Header, Item, Logo, Nav, Separator } from '../styles/navigation.style'
import { Button } from '../styles/_app.style'
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Link, links } from '../constants/links'
import useAuth from '../lib/auth.service'

/**
 * TODO: Extract the colours as a constant and implement functionality for the buttons!
 */
export const Navigation = () => {
  const { username } = useUser()
  const { logoutUser } = useAuth()
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <Header>
      <Nav>
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          {/* TODO: We might need to store logos separately if they're theme-configurable */}
          <Logo alt="Scientia logo" src="assets/logo.svg" style={{ filter: `invert(${theme === 'dark' ? 1 : 0})` }} />
          <span style={{ marginLeft: '0.5rem', fontSize: 'x-large', fontWeight: 600 }}>Scientia</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button icon css={{ marginRight: '1rem' }}>
            {/* TODO: This button should trigger a command palette */}
            <Search size={22} />
          </Button>

          {/* Quick Links */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon css={{ marginRight: '1rem' }}>
                <Command size={22} />
              </Button>
            </DropdownMenuTrigger>
            <Content>
              {links.map((link: Link) => (
                <Item onSelect={() => window.open(link.url, '_blank')}>
                  {link.icon}
                  {link.title}
                </Item>
              ))}
            </Content>
          </DropdownMenu>

          {/* User Preferences */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon>
                <Avatar
                  size={32}
                  name={username}
                  variant="marble"
                  colors={['#264653', '#2A9d8F', '#E9C46A', '#F4A261', '#E76F51']}
                />
              </Button>
            </DropdownMenuTrigger>
            <Content>
              {/* TODO: Refactor the margins to avoid repetition */}
              <Item onSelect={toggleTheme}>
                {theme === 'light' ? (
                  <SunFill size={20} style={{ margin: '0 0.5rem 0 0.5rem' }} />
                ) : (
                  <MoonFill size={20} style={{ margin: '0 0.5rem 0 0.5rem' }} />
                )}
                Toggle Theme
              </Item>
              <Separator />
              <Item onSelect={logoutUser}>
                <DoorClosedFill size={20} style={{ margin: '0 0.5rem 0 0.5rem' }} />
                Logout
              </Item>
            </Content>
          </DropdownMenu>
        </div>
      </Nav>
    </Header>
  )
}

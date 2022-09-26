import { DropdownMenu, DropdownMenuTrigger, ItemIndicator } from '@radix-ui/react-dropdown-menu'
import { useContext } from 'react'
import {
  CalendarDate,
  Check,
  Dice5Fill,
  DoorClosedFill,
  GearWideConnected,
  Justify,
  MoonFill,
  SunFill,
} from 'react-bootstrap-icons'
import { useNavigate, useParams } from 'react-router-dom'

import { LINKS } from '../constants/links'
import useAuth from '../lib/auth.service'
import { useGame } from '../lib/game/game.context'
import { gameEnabled } from '../lib/game/levels.service'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { capitaliseFirstLetter, currentShortYear, formatShortYear } from '../lib/utilities.service'
import { Button } from '../styles/_app.style'
import { ActionButton } from '../styles/dialog.style'
import {
  CheckboxItem,
  Content,
  DropdownIcon,
  Header,
  Item,
  Logo,
  Nav,
  Separator,
  VerticalRule,
  WebsiteTitle,
} from '../styles/navigation.style'
import { YearSwitcher } from './YearSwitcher'

/**
 * TODO: Extract the colours as a constant and implement functionality for the buttons!
 * TODO: Show a banner under the header if the requested year isn't the current year.
 */
export const Navigation = () => {
  const { userDetails } = useUser()
  const { logoutUser } = useAuth()
  const { requestedYear: year } = useParams()
  const currentYear = currentShortYear()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { includeLevels, toggleIncludeLevels } = useGame()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  return (
    <Header>
      <Nav>
        {/* TODO: Is it a good idea to use an modified icon button here instead of a custom variant? */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a href={isLoggedIn() ? `/${year}/modules` : '/'} title="View modules">
            <Button
              icon
              role="link"
              css={{ width: 'auto', '&:hover': { backgroundColor: 'transparent' } }}
            >
              {/* TODO: We might need to store logos separately if they're theme-configurable */}
              <Logo
                alt="Scientia logo"
                src="/assets/logo.svg"
                style={{ filter: `invert(${theme === 'dark' ? 1 : 0})` }}
              />
              <WebsiteTitle>Scientia</WebsiteTitle>
            </Button>
          </a>
          <VerticalRule />
          <a href={`/${year}/timeline`} title="View timeline">
            <Button icon>
              <CalendarDate size={22} />
            </Button>
          </a>
        </div>

        {year !== currentYear && (
          <ActionButton.Primary
            style={{ padding: '0.5rem 1rem' }}
            onClick={() => navigate('/' + currentYear + window.location.pathname.slice(5))}
          >
            Go to {formatShortYear()}
          </ActionButton.Primary>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* User Preferences */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon title="User preferences">
                <GearWideConnected size={22} />
              </Button>
            </DropdownMenuTrigger>
            <Content align="start">
              <Item
                onSelect={toggleTheme}
                title={`Use a ${theme === 'light' ? 'dark' : 'light'} appearance`}
              >
                <DropdownIcon>{theme === 'light' ? <MoonFill /> : <SunFill />}</DropdownIcon>
                <span>{capitaliseFirstLetter(theme === 'light' ? 'dark' : 'light') + ' mode'}</span>
              </Item>
              <Separator />
              <YearSwitcher />
              <Separator />

              {gameEnabled && !userDetails?.isStaff && (
                <>
                  <CheckboxItem checked={includeLevels} onCheckedChange={toggleIncludeLevels}>
                    <Dice5Fill size={20} style={{ margin: '0 0.5rem' }} />
                    <span style={{ flexGrow: 1 }}>Game Levels</span>
                    <ItemIndicator>
                      <Check size={30} />
                    </ItemIndicator>
                  </CheckboxItem>
                  <Separator />
                </>
              )}
              <Item onSelect={logoutUser}>
                <DropdownIcon>
                  <DoorClosedFill size={20} />
                </DropdownIcon>
                Logout
              </Item>
            </Content>
          </DropdownMenu>

          {/* Quick Links */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon title="Useful websites">
                <Justify size={22} />
              </Button>
            </DropdownMenuTrigger>
            <Content align="start">
              {LINKS.map((link) => (
                <a href={link.url} target="_blank" rel="noreferrer" title={link.description}>
                  <Item link key={link.title} style={{ padding: '0.5rem' }}>
                    <link.icon size={16}></link.icon>
                    {link.title}
                  </Item>
                </a>
              ))}
            </Content>
          </DropdownMenu>
        </div>
      </Nav>
    </Header>
  )
}

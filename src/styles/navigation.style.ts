import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu'

import { styled } from './stitches.config'

export const Header = styled('div', {
  height: '4rem',
  width: '100%',

  /* Make sure that the header is fixed and above every component */
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,

  display: 'flex',
  alignContent: 'center',

  padding: '0',
  borderBottom: '0.0625rem solid $separator',
  backgroundColor: '$appBackground',

  transitionProperty: 'background-color, border-bottom',
  transitionDuration: '1s',
  transitionTimingFunction: 'ease-in-out',
})

export const Nav = styled('nav', {
  maxWidth: '42rem',

  display: 'flex',
  flexGrow: 1,
  justifyContent: 'space-between',

  padding: '0 1rem',
  margin: 'auto',
})

export const Logo = styled('img', {
  height: '2rem',
})

export const Content = styled(DropdownMenuContent, {
  minWidth: '14rem',
  backgroundColor: '$appBackground',
  borderRadius: '0.75rem',
  padding: '0.5rem',
  border: '0.0625rem solid $separator',
})

export const Item = styled(DropdownMenuItem, {
  borderRadius: '0.5rem',
  padding: '0.25rem',
  height: '2.75rem',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 250ms ease-in-out 0s',
  '&:focus': {
    backgroundColor: '$elementHover',
    outline: 'none',
  },
})

export const Separator = styled(DropdownMenuSeparator, {
  height: '0.0625rem',
  margin: '0.25rem',
  backgroundColor: '$separator',
})

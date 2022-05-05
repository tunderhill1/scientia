import { styled } from './stitches.config'

export const Header = styled('div', {
  height: '4rem',
  width: '100%',
  /* Make sure that the header is fixed and above every component */
  position: 'fixed',
  zIndex: '9999',
  padding: '1rem 0',
  marginBottom: '3rem',
  borderBottom: '1px solid #82838233' /* Temporary fix */,
  backgroundColor: '$backgroundColor',
  transition: 'background-color 1s ease-in-out',
  '-webkit-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'grayscale',
})

export const Nav = styled('nav', {
  maxWidth: '42rem',
  padding: '0 1rem',
  margin: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
})

export const Logo = styled('img', {
  height: '2rem',
})

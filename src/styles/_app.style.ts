import { styled } from './stitches.config'

export const Container = styled('div', {
  maxWidth: '42rem',
  margin: 'auto',
  padding: '0 1rem',
  display: 'flex',
  flexDirection: 'column',
})

export const Logo = styled('img', {
  height: '20rem',
  margin: '4rem',
})

export const Button = styled('button', {
  backgroundColor: '$color',
  color: '$backgroundColor',
  width: '100%',
  height: '2.75rem',
  maxWidth: '12rem',
  minWidth: '9rem' /* Temporary fix */,
  border: 'none',
  borderRadius: '0.5rem',
  marginTop: '1rem',
  fontSize: 'medium',
})

/* TODO: Extract this into a separate component */
export const TabsWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
})

export const Tab = styled('a', {
  padding: '0.75rem',
  color: '$color',
  display: 'flex',
  position: 'relative',
  cursor: 'pointer',
  transition: 'color 250ms',
  justifyContent: 'space-between',
})

export const TabsHighlight = styled('div', {
  background: '#828382' /* Temporary fix */,
  position: 'absolute',
  borderRadius: '0.5rem',
  height: '2.75rem',
  transition: '0.15s ease',
  transitionProperty: 'width, transform, opacity',
})

import { styled } from './stitches.config'

export const Container = styled('div', {
  maxWidth: '42rem',
  margin: 'auto',
  padding: '7rem 1rem 0 1rem',
  display: 'flex',
  flexDirection: 'column',
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

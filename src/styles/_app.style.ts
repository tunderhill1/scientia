import { styled } from './stitches.config'

export const Container = styled('div', {
  padding: '0 2rem',
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
  maxWidth: '10rem',
  height: '2.25rem',
  border: 'none',
  borderRadius: '0.375rem',
})

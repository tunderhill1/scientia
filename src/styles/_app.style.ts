import { styled } from './stitches.config'

export const Container = styled('div', {
  maxWidth: '42rem',
  margin: 'auto',
  padding: '7rem 1rem 0 1rem',
  display: 'flex',
  flexDirection: 'column',
})

export const Button = styled('button', {
  backgroundColor: '$elementBackground',
  color: '$highContrast',
  width: '100%',
  height: '2.75rem',
  border: 'none',
  borderRadius: '0.5rem',
  marginTop: '1rem',
  fontSize: 'medium',
  '&:hover': {
    backgroundColor: '$elementHover',
  },
  '&:active': {
    backgroundColor: '$elementActive',
  },
  variants: {
    icon: {
      true: {
        marginTop: 0,
        width: '2.75rem',
        background: 'none',
      },
    },
  },
})

import { styled } from './stitches.config'
import { Checkbox as CheckboxPrimitive, CheckboxIndicator } from '@radix-ui/react-checkbox'

export const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  alignItems: 'center',
  backgroundColor: '$subtleBackground',
  padding: '1rem',
  borderRadius: '1rem',
  border: '0.0625rem solid $separator',
  minWidth: '20rem',
  '@media(max-width: 600px)': {
    width: '100%',
  },
})

export const Logo = styled('img', {
  height: '4.5rem',
  marginBottom: '1rem',
  marginTop: '1rem',
  userSelect: 'none',
  '-moz-user-select': 'none',
  '-webkit-user-select': 'none',
})

export const Name = styled('h1', {
  margin: 0,
  fontWeight: 600,
})

export const Tagline = styled('p', {
  color: '$lowContrast',
})

export const Fieldset = styled('fieldset', {
  all: 'unset',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  alignItems: 'flex-start',
  width: '100%',
  variants: {
    horizontal: {
      true: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
  },
})

export const Label = styled('label', {
  textAlign: 'right',
})

export const Input = styled('input', {
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
  borderRadius: '0.5rem',
  padding: '0.75rem',
  height: '2.75rem',
  backgroundColor: '$elementBackground',
  transition: 'background-color 0.3s ease-in-out',
  '&:focus': {
    backgroundColor: '$appBackground',
    border: '0.0625rem solid $elementBorder',
  },
})

export const Checkbox = styled(CheckboxPrimitive, {
  all: 'unset',
  boxSizing: 'border-box',
  backgroundColor: '$elementBackground',
  width: '1.75rem',
  height: '1.75rem',
  borderRadius: '0.375rem',
  '&:hover': { backgroundColor: '$elementHover' },
  '&:focus': {
    backgroundColor: '$appBackground',
    border: '0.0625rem solid $elementBorder',
  },
})

export const Indicator = styled(CheckboxIndicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

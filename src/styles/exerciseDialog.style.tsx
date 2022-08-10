import { Trash3Fill } from 'react-bootstrap-icons'

import { styled } from './stitches.config'

// TODO: refactor this css
export const SpecLink = styled('a', {
  width: 'auto',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  border: '2px solid $sand8',
  color: '$sand8',
  fontWeight: 600,
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-flex',
  cursor: 'pointer',
  userSelect: 'none',
  marginTop: '24px',
  transition: 'all .1s ease-in',
  '&:hover': {
    background: '$blue9',
    border: '2px solid $blue9',
    color: 'white',
    fill: 'white',
  },
})

export const TrashButton = styled(Trash3Fill, {
  fontSize: '1rem',
  '&:hover': {
    fill: 'red',
  },
})

export const UploadWrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
})

/* TODO: Implement user specified overrides */
export const UploadButton = styled('label', {
  all: 'unset',
  padding: '1rem',
  borderRadius: '12px',
  color: '$highContrast',
  display: 'flex',
  cursor: 'pointer',
  justifyContent: 'space-between',
  '&:hover': {
    opacity: '80%',
  },
})

export const ModulePill = styled('p', {
  background: '$blue5',
  fontSize: '14px',
  borderRadius: '16px',
  padding: '4px 12px',
  display: 'inline-block',
  width: 'fit-content',
  margin: 0,
  textAlign: 'center',
})

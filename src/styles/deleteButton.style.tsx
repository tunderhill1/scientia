import { Arrow, Content } from '@radix-ui/react-popover'

import { styled } from './stitches.config'

export const PopoverContent = styled(Content, {
  border: '2px solid $sand11',
  outline: 'none',
  backgroundColor: '$sand2',
  zIndex: 11,
  boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  padding: '1rem',
})

export const PopoverArrow = styled(Arrow, {
  fill: '$sand11',
})

export const TrashButton = styled('button', {
  width: 'fit-content',
  alignItems: 'center',
  padding: '0.5rem',
  color: '$highContrast',
  fill: '$highContrast',
  fontWeight: 500,
  fontSize: '16px',
  borderRadius: '8px',
  display: 'inline-flex',
  cursor: 'pointer',
  transition: 'all .1s ease-in',
  border: '2px solid $sand8',
  backgroundColor: 'white',
  '&:hover': {
    background: '$sand4',
  },
})

import { styled } from './stitches.config'

export const Tag = styled('span', {
  fontSize: '0.8rem',
  color: '$lowContrast',
})

export const Tags = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: '0.5rem',
})

export const Material = styled('div', {
  minHeight: '2.5rem',
  gap: '0.1rem',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
})

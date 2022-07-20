import { styled } from '../stitches.config'

export const TrackItemWrapper = styled('div', {
  cursor: 'pointer',
  margin: '0.5rem 0.25rem',
  borderRadius: '0.5rem',
  padding: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '0.125rem solid transparent',
})

export const TrackItemTitle = styled('span', {
  fontSize: '1rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

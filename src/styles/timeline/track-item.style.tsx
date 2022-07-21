import { styled } from '../stitches.config'

export const TrackItemWrapper = styled('div', {
  cursor: 'pointer',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
})

export const TrackItemTitle = styled('span', {
  fontSize: '1rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

import { CSS } from '@stitches/react'

import { Exercise } from '../../constants/types'
import { now } from '../../lib/utilities.service'
import { styled } from '../stitches.config'

export const TrackItemWrapper = styled('div', {
  cursor: 'pointer',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  height: 'fit-content',
  margin: 'auto 0',
})

export const TrackItemTitle = styled('span', {
  fontSize: '1rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export const trackItemStyles = ({
  submissionType,
  isAssessed,
  startDate,
  deadline,
}: Exercise): CSS => {
  let style: CSS = { borderWidth: 1, borderStyle: 'solid' }

  if (isAssessed) {
    if (submissionType === 'individual') {
      // assessed and individual exercise
      style.borderColor = '$green5'
      style.backgroundColor = '$green3'
      style['&:hover'] = { backgroundColor: '$green4' }
    }
    if (submissionType === 'group') {
      // assessed and group exercise
      style.borderColor = '$plum5'
      style.backgroundColor = '$plum3'
      style['&:hover'] = { backgroundColor: '$plum4' }
    }
  } else {
    if (submissionType === 'no submission required') {
      // unassessed and no submission required
      style.borderColor = '$neutral7'
      style.backgroundColor = '$neutral1'
      style['&:hover'] = { backgroundColor: '$neutral3' }
    } else {
      // unassessed and requires a submission
      style.borderColor = '$orange5'
      style.backgroundColor = '$orange3'
      style['&:hover'] = { backgroundColor: '$orange4' }
    }
  }

  // user can interact with exercise and hasn't submitted required files
  if (startDate <= now() && now() <= deadline) {
    style.borderWidth = 2
    style.borderColor = '$red8'
    style.fontWeight = 600
  }

  return style
}

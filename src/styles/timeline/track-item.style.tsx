import { CSS } from '@stitches/react'

import { Exercise } from '../../constants/types'
import { now } from '../../lib/utilities.service'
import { styled } from '../stitches.config'

export const TrackItemTitle = styled('div', {
  fontSize: '1rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export const trackItemStyles = ({
  exercise,
  startColumn,
  endColumn,
  row,
}: {
  exercise: Exercise
  startColumn: number
  endColumn: number
  row: number
}) => {
  const isSingleDay = endColumn - startColumn < 2
  return {
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content',
    margin: 'auto 0',

    gridColumn: `${startColumn} / ${endColumn}`,
    gridRow: `${row + 1}`, // Grid is 1-indexed
    justifyContent: isSingleDay ? 'center' : 'space-between',
    padding: isSingleDay ? '0.25rem' : '0.5rem',
    textAlign: isSingleDay ? 'center' : 'left',
    ...trackItemExerciseStyle(exercise),
  }
}

/**
 * Style each track item's border, colour, etc. based on the exercise details
 * to help users distinguish group/individual etc */
export const trackItemExerciseStyle = ({
  submissionType,
  isAssessed,
  startDate,
  deadline,
}: Exercise): CSS => {
  let style: CSS = { borderWidth: 1, borderStyle: 'solid' }

  if (isAssessed) {
    if (submissionType === 'individual') {
      // assessed and individual exercise
      style.borderColor = '$green7'
      style.backgroundColor = '$green4'
      style['&:hover'] = { backgroundColor: '$green5' }
    }
    if (submissionType === 'group') {
      // assessed and group exercise
      style.borderColor = '$plum7'
      style.backgroundColor = '$plum4'
      style['&:hover'] = { backgroundColor: '$plum5' }
    }
  } else {
    if (submissionType === 'no submission required') {
      // unassessed and no submission required
      style.borderColor = '$neutral7'
      style.backgroundColor = '$neutral1'
      style['&:hover'] = { backgroundColor: '$neutral3' }
    } else {
      // unassessed and requires a submission
      style.borderColor = '$orange7'
      style.backgroundColor = '$orange4'
      style['&:hover'] = { backgroundColor: '$orange5' }
    }
  }

  // user can interact with exercise and hasn't submitted required files
  if (startDate <= now() && now() < deadline && submissionType !== 'no submission required') {
    style.borderWidth = 2
    style.borderColor = '$red8'
    style.fontWeight = 600
  }

  return style
}

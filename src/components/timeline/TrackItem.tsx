import { format as formatTimeAgo } from 'timeago.js'

import { Exercise } from '../../constants/types'
import { css } from '../../styles/stitches.config'
import {
  TrackItemTitle,
  TrackItemWrapper,
  trackItemStyles,
} from '../../styles/timeline/track-item.style'

export const TrackItem = ({
  exercise,
  startColumn,
  endColumn,
  row,
  onClick,
  disabled,
}: {
  exercise: Exercise
  startColumn: number
  endColumn: number
  row: number
  onClick: () => void
  disabled: boolean
}) => {
  const isSingleDay = endColumn - startColumn < 2
  return (
    <TrackItemWrapper
      title={`${exercise.type}: ${exercise.title} - due ${formatTimeAgo(exercise.deadline)}`}
      onClick={onClick}
      className={css({
        cursor: disabled ? 'default' : 'pointer',
        gridColumn: `${startColumn} / ${endColumn}`,
        gridRow: `${row + 1}`, // Grid is 1-indexed
        justifyContent: isSingleDay ? 'center' : 'space-between',
        padding: isSingleDay ? '0.25rem' : '0.5rem',
        textAlign: isSingleDay ? 'center' : 'left',
        ...trackItemStyles(exercise),
      })()}
    >
      {!isSingleDay && (
        <TrackItemTitle>
          <span style={{ fontWeight: 500 }}>{exercise.type}</span>
          &nbsp;{exercise.title}
        </TrackItemTitle>
      )}
    </TrackItemWrapper>
  )
}

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
      <TrackItemTitle>
        {isSingleDay ? (
          <>
            <span style={{ fontWeight: 500 }}>{exercise.number}</span>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 500 }}>
              {exercise.type} {exercise.number}:
            </span>
            &nbsp;{exercise.title}
            {exercise.estimatedWorkHours ? (
              <div
                className={css({
                  display: 'flex',
                  flexWrap: 'wrap',
                  columnGap: '0.5rem',
                  fontSize: '0.9rem',
                  color: '$lowContrast',
                })()}
              >
                Estimate: {exercise.estimatedWorkHours}h
              </div>
            ) : (
              ''
            )}
          </>
        )}
      </TrackItemTitle>
    </TrackItemWrapper>
  )
}

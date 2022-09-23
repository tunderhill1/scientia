import { Exercise } from '../../constants/types'
import { css } from '../../styles/stitches.config'
import { TrackItemTitle, TrackItemWrapper } from '../../styles/timeline/track-item.style'

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
      onClick={onClick}
      className={css({
        cursor: disabled ? 'default' : 'pointer',
        gridColumn: `${startColumn} / ${endColumn}`,
        gridRow: `${row + 1}`, // Grid is 1-indexed
        justifyContent: isSingleDay ? 'center' : 'space-between',
        padding: isSingleDay ? '0.25rem' : '0.5rem',
        textAlign: isSingleDay ? 'center' : 'left',
        backgroundColor: '$blue5',
        // color: `...`,
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

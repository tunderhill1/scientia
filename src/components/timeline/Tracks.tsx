import { TIMELINE_TRACK_HEIGHT } from '../../constants/global'
import { Term, TrackMap } from '../../constants/types'
import { dateToColumn } from '../../pages/Timeline'
import { WEEKDAYS_WIDTHS, WEEKEND_WIDTH } from '../../styles/timeline/constants.style'
import { Grid } from '../../styles/timeline/tracks.style'
import { TrackItem } from './TrackItem'

export const Tracks = ({ term, trackMap, weeks }: { term: Term; trackMap: TrackMap; weeks: number }) => {
  // Ad hoc calculation of grid-template-rows heights to align to the hardcoded padding of the Module tabs
  const gridTemplateRows = Object.entries(trackMap)
    .map(([_, tracks]) => {
      return tracks
        .map((_, i) => {
          if (tracks.length === 1) return `calc(${TIMELINE_TRACK_HEIGHT} + 0.75rem * 2)`
          if (i === 0) return `calc(${TIMELINE_TRACK_HEIGHT} + 0.75rem)`
          if (tracks.length === i + 1) return `calc(${TIMELINE_TRACK_HEIGHT} + 0.75rem)`
          return `calc(${TIMELINE_TRACK_HEIGHT})`
        })
        .join(' ')
    })
    .join(' ')

  return (
    <Grid
      css={{
        gridTemplateColumns: `repeat(${weeks}, ${WEEKDAYS_WIDTHS} ${WEEKEND_WIDTH})`,
        gridTemplateRows: gridTemplateRows,
      }}
    >
      {Object.values(trackMap)
        .flat()
        .map((track, trackIndex) => {
          return track.map((exercise) => {
            return (
              <TrackItem
                key={`${trackIndex}-${exercise.number}`}
                exercise={exercise}
                startColumn={dateToColumn(exercise.startDate, term.start)}
                endColumn={dateToColumn(exercise.endDate, term.start)}
                row={trackIndex + 1}
                onClick={() => console.log(`Clicked on '${exercise.title}'`)}
              />
            )
          })
        })}
    </Grid>
  )
}

import { TrackMap } from '../../constants/types'
import { WEEKDAYS_WIDTHS, WEEKEND_WIDTH } from '../../styles/timeline/constants.style'
import { Grid } from '../../styles/timeline/tracks.style'

export const Tracks = ({
  trackMap,
  weeks,
  rowHeights,
}: {
  trackMap: TrackMap
  weeks: number
  rowHeights: { [code: string]: string }
}) => {
  return (
    <Grid
      css={{
        gridTemplateColumns: `repeat(${weeks}, ${WEEKDAYS_WIDTHS} ${WEEKEND_WIDTH})`,
        gridTemplateRows: Object.values(rowHeights).join(' '),
      }}
    ></Grid>
  )
}

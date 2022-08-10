import { COLS_IN_WEEK } from '../../constants/global'
import { WEEKDAYS_WIDTHS, WEEKEND_WIDTH } from '../../styles/timeline/constants.style'
import { CurrentDayColumn, Grid } from '../../styles/timeline/day-indicator.style'

export const DayIndicator = ({
  weeks,
  currentDayColumn,
}: {
  weeks: number
  currentDayColumn: number
}) => {
  /* Current day column visible only if (a) within the boundaries of the grid and if (b) current day is a week day */
  const currentDayColumnIsWithinGrid =
    currentDayColumn > 0 &&
    currentDayColumn <= weeks * COLS_IN_WEEK &&
    currentDayColumn % COLS_IN_WEEK !== 0

  return (
    <Grid
      css={{
        gridTemplateColumns: `repeat(${weeks}, ${WEEKDAYS_WIDTHS} ${WEEKEND_WIDTH})`,
      }}
    >
      <CurrentDayColumn
        visible={currentDayColumnIsWithinGrid}
        css={{
          gridColumn: `${currentDayColumn} / ${currentDayColumn + 1}`,
        }}
      />
    </Grid>
  )
}

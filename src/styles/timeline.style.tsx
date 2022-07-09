import { styled } from './stitches.config'

/* Background layout: general overview */
/* +------------+------------+------------+------------+------------+--------+ */
/* | Week                                                                    | */
/* | Mon          Tue          Wed          Thu          Fri                 | */
/* +------------+------------+------------+------------+------------+--------+ */
/* | <- 3rem -> | <- 3rem -> | <- 3rem -> | <- 3rem -> | <- 3rem -> | 0.5rem | */

const WEEKDAYS_WIDTHS = '3rem 3rem 3rem 3rem 3rem'
const WEEKEND_WIDTH = '0.5rem'

// This is the main timeline area
export const Background = styled('div', {
  gridArea: 'background',
  backgroundColor: '$appBackground',
  display: 'grid',
  gridTemplateColumns: `repeat(10, ${WEEKDAYS_WIDTHS} ${WEEKEND_WIDTH})`,
  gridTemplateRows: 'repeat(10, 4rem)',
  padding: '0.5rem',
})

export const Grid = styled('div', {
  gridArea: 'background',
  display: 'grid',
  gridTemplateRows: 'auto',
  rowGap: 0,
  columnGap: '0.5rem',

  zIndex: 1,
  paddingRight: '1rem',
  paddingBottom: '1rem',
})

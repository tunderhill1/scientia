import { styled } from './stitches.config'

const FST_COL_FIXED_WIDTH = '16.875rem'
const FST_ROW_FIXED_HEIGHT = '7rem'

export const TimelineContainer = styled('div', {
  display: 'grid',
  gridTemplateAreas: '"switcher weeks" "modules background"',
  gridTemplateRows: `${FST_ROW_FIXED_HEIGHT} auto`,
  /* Lock width of the first column while letting the second expand */
  gridTemplateColumns: `${FST_COL_FIXED_WIDTH} auto`,
  width: '100%',
  height: '100%',
})

export const Modules = styled('div', {
  gridArea: 'modules',
  backgroundColor: 'green',
})

// This is the main timeline area
export const Background = styled('div', {
  gridArea: 'background',
  backgroundColor: '$appBackground',
})

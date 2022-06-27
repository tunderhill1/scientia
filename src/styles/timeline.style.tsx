import { styled } from './stitches.config'

const FST_COL_FIXED_WIDTH = '16.875rem'

export const TimelineContainer = styled('div', {
  display: 'grid',
  gridTemplateAreas: '"switcher weeks" "modules background"',
  gridTemplateRow: 'auto',

  // Lock width of the first column while letting the second expand
  gridTemplateColumns: `${FST_COL_FIXED_WIDTH} auto`,
  minWidth: '200rem',
  minHeight: '100rem',
})

export const Switcher = styled('div', {
  gridArea: 'switcher',
  backgroundColor: 'blue',
  minWidth: '100%',
})

export const Weeks = styled('div', {
  gridArea: 'weeks',
  backgroundColor: 'yellow',
  minWidth: '100%',
})

export const Modules = styled('div', {
  gridArea: 'modules',
  backgroundColor: 'green',
  minWidth: '100%',
})

// This is the main timeline area
export const Background = styled('div', {
  gridArea: 'background',
  backgroundColor: 'red',
  minWidth: '100%',
})

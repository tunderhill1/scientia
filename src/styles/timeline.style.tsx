import { styled } from './stitches.config'
import { Wrapper } from './_app.style'
import { ToggleGroup as ToggleGroupPrimitive, ToggleGroupItem } from '@radix-ui/react-toggle-group'
import { itemStyles } from './toolbar.style'

const FST_COL_FIXED_WIDTH = '16.875rem'
const FST_ROW_FIXED_HEIGHT = '7rem'

export const TimelineContainer = styled('div', {
  display: 'grid',
  gridTemplateAreas: '"switcher weeks" "modules background"',
  gridTemplateRows: `${FST_ROW_FIXED_HEIGHT} auto`,

  // Lock width of the first column while letting the second expand
  gridTemplateColumns: `${FST_COL_FIXED_WIDTH} auto`,
  width: '100%',
  height: '100%',
})

export const Switcher = styled(Wrapper, {
  gridArea: 'switcher',
  backgroundColor: 'blue',
})

export const Weeks = styled('div', {
  gridArea: 'weeks',
  backgroundColor: 'yellow',
})

export const Modules = styled('div', {
  gridArea: 'modules',
  backgroundColor: 'green',
})

// This is the main timeline area
export const Background = styled('div', {
  gridArea: 'background',
  backgroundColor: 'red',
})

export const SwitcherItem = styled(ToggleGroupItem, {
  ...itemStyles,
  width: '2.75rem',
  height: '2.75rem',
  background: 'none',
  '&[data-state=on]': {
    backgroundColor: '$elementActive',
  },
})

export const SwitcherGroup = styled(ToggleGroupPrimitive, {
  display: 'flex',
  borderRadius: '0.25rem',
})

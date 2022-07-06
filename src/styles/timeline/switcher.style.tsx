import { styled } from '../stitches.config'
import { ToggleGroup as ToggleGroupPrimitive, ToggleGroupItem } from '@radix-ui/react-toggle-group'
import { itemStyles } from '../toolbar.style'

/* Both group and item have no styling connections with the timeline and can be extracted to _app.style if needed */
export const Group = styled(ToggleGroupPrimitive, {
  display: 'flex',
  borderRadius: '0.25rem',
})

export const Item = styled(ToggleGroupItem, {
  ...itemStyles,
  width: '2.75rem',
  height: '2.75rem',
  background: 'none',
  '&[data-state=on]': {
    backgroundColor: '$elementActive',
  },
})

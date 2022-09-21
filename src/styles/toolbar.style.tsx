import { Toggle as TogglePrimitive } from '@radix-ui/react-toggle'
import { ToolbarButton, Toolbar as ToolbarPrimitive } from '@radix-ui/react-toolbar'

import { styled } from './stitches.config'

export const ToolbarContainer = styled(ToolbarPrimitive, {
  display: 'flex',
  width: '100%',
  minWidth: 'max-content',
})

export const itemStyles = {
  all: 'unset',
  flex: '0 0 auto',
  height: '2.75rem',
  borderRadius: '0.5rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const Button = styled(ToolbarButton, {
  ...itemStyles,
  paddingLeft: 10,
  paddingRight: 10,
})

export const Toggle = styled(TogglePrimitive, {
  ...itemStyles,
  display: 'inline-flex',
  width: '2.75rem',
  height: '2.75rem',
  borderRadius: '0.5rem',
  '&[data-state=on]': {
    backgroundColor: '$elementActive',
  },
})

// export const ToggleItem = styled(ToolbarPrimitive.ToggleItem, {
//   ...itemStyles,
//   boxShadow: 0,
//   backgroundColor: 'white',
//   marginLeft: 2,
//   '&:first-child': { marginLeft: 0 },
//   '&[data-state=on]': { backgroundColor: violet.violet5, color: violet.violet11 },
// })

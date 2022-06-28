import { styled } from './stitches.config'
import {
  Toolbar as ToolbarPrimitive,
  ToolbarButton,
  ToolbarToggleItem,
  ToolbarToggleGroup,
} from '@radix-ui/react-toolbar'

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

export const ToggleItem = styled(ToolbarToggleItem, {
  ...itemStyles,
  width: '2.75rem',
  height: '2.75rem',
  background: 'none',
  '&[data-state=on]': {
    backgroundColor: '$elementActive',
  },
})

export const ToggleGroup = styled(ToolbarToggleGroup, {
  display: 'inline-flex',
  borderRadius: '0.25rem',
})

// export const ToggleItem = styled(ToolbarPrimitive.ToggleItem, {
//   ...itemStyles,
//   boxShadow: 0,
//   backgroundColor: 'white',
//   marginLeft: 2,
//   '&:first-child': { marginLeft: 0 },
//   '&[data-state=on]': { backgroundColor: violet.violet5, color: violet.violet11 },
// })

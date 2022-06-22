import React from 'react'
import { styled } from '@stitches/react'
import { blackA, mauve, violet } from '@radix-ui/colors'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'

export const Toolbar = styled(ToolbarPrimitive.Root, {
  display: 'flex',
  padding: 10,
  width: '100%',
  minWidth: 'max-content',
  borderRadius: 6,
  backgroundColor: 'white',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
})

export const itemStyles = {
  all: 'unset',
  flex: '0 0 auto',
  color: mauve.mauve11,
  height: 25,
  padding: '0 5px',
  borderRadius: 4,
  display: 'inline-flex',
  fontSize: 13,
  lineHeight: 1,
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { backgroundColor: violet.violet3, color: violet.violet11 },
  '&:focus': { position: 'relative', boxShadow: `0 0 0 2px ${violet.violet7}` },
}

export const Button = styled(
  ToolbarPrimitive.Button,
  {
    ...itemStyles,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'white',
    backgroundColor: violet.violet9,
  },
  { '&:hover': { color: 'white', backgroundColor: violet.violet10 } }
)

export const Link = styled(
  ToolbarPrimitive.Link,
  {
    ...itemStyles,
    backgroundColor: 'transparent',
    color: mauve.mauve11,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  { '&:hover': { backgroundColor: 'transparent', cursor: 'pointer' } }
)

export const Separator = styled(ToolbarPrimitive.Separator, {
  width: 1,
  backgroundColor: mauve.mauve6,
  margin: '0 10px',
})

export const ToggleGroup = styled(ToolbarPrimitive.ToggleGroup, {
  display: 'inline-flex',
  borderRadius: 4,
})

export const ToggleItem = styled(ToolbarPrimitive.ToggleItem, {
  ...itemStyles,
  boxShadow: 0,
  backgroundColor: 'white',
  marginLeft: 2,
  '&:first-child': { marginLeft: 0 },
  '&[data-state=on]': { backgroundColor: violet.violet5, color: violet.violet11 },
})

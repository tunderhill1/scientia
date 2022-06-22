import { styled } from './stitches.config'
import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { CaretRightFill } from 'react-bootstrap-icons'
import { keyframes } from '@stitches/react'

/* TODO: Remove Accordion and Item and use it directly in the file */
export const Accordion = styled(AccordionPrimitive, {})

export const Item = styled(AccordionItem, {})

export const Header = styled(AccordionHeader, {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
})

/* TODO: Make the trigger height and style user-configurable */
export const Trigger = styled(AccordionTrigger, {
  all: 'unset',
  boxSizing: 'border-box',
  userSelect: 'none',
  cursor: 'pointer',

  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',

  height: '2.75rem',
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.5rem',

  zIndex: 1,
  position: 'sticky',
  backgroundColor: '$appBackground',
  top: '4rem' /* Height of navigation bar */,

  transition: 'all 250ms ease-in-out',

  '&:active': {
    backgroundColor: '$elementActive',
  },
  '&:hover': {
    backgroundColor: '$elementHover',
  },

  /* TODO: The style below is copied over from button; investigate a way to extract as common style */
  outlineColor: 'transparent',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: '0.25rem solid $elementBorder',
    zIndex: 2,
    /* NOTE: Transition "all" would cause a weird visual artefact as you're transitioning the outline width */
    transition: 'outline-color 250ms ease-in-out 0s',
  },
})

/* NOTE: The collapsible content height matches the maxHeight set manually in code */
const slideDown = keyframes({
  from: { maxHeight: 0, opacity: 0, padding: 0 },
  to: { maxHeight: 'var(--radix-collapsible-content-height)', opacity: 1 },
})

const slideUp = keyframes({
  from: { maxHeight: 'var(--radix-collapsible-content-height)', opacity: 1 },
  to: { maxHeight: 0, opacity: 0, padding: 0 },
})

export const Content = styled(AccordionContent, {
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'row',
  gap: '0.75rem',

  /* NOTE: Timing curve sourced from Radix UI's accordion example */
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
})

/* TODO: Allow user to override these styles */
export const Box = styled('div', {
  flexGrow: 1,
  width: '100%',
  borderLeft: '0.0625rem solid $separator',
  padding: '0.5rem 0 0.5rem 0.5rem',
  marginLeft: '1.25rem',
})

export const Caret = styled(CaretRightFill, {
  marginRight: '0.5rem',
  fill: '$lowContrast',
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(90deg)' },
})

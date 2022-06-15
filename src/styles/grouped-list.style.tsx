import { styled } from './stitches.config'
import {
  Accordion as AccordionPrimitive,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionHeader,
} from '@radix-ui/react-accordion'
import { CaretRightFill } from 'react-bootstrap-icons'
import { keyframes } from '@stitches/react'

/* TODO: Remove Accordion and Item and use it directly in the file */
export const Accordion = styled(AccordionPrimitive, {})

export const Item = styled(AccordionItem, {})

/* TODO: Make the header height and style user-configurable */
export const Header = styled(AccordionHeader, {
  all: 'unset',
  display: 'flex',
  height: '2.75rem',
  position: 'sticky',
  backgroundColor: '$appBackground',
  zIndex: 1,
  top: '0',
})

export const Trigger = styled(AccordionTrigger, {
  all: 'unset',
  userSelect: 'none',
  cursor: 'pointer',

  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',

  padding: '0.75rem',
  borderRadius: '0.5rem',

  transition: 'all 250ms ease-in-out',

  /* NOTE: "Hover" effect is taken care of by the onMouseEnter event */
  '&:active': {
    backgroundColor: '$elementActive',
  },
  '&:focus-visible': {
    backgroundColor: '$elementHover',
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

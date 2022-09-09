import { DialogContent, DialogOverlay, DialogTitle } from '@radix-ui/react-dialog'
import { keyframes } from '@stitches/react'

import { styled } from './stitches.config'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

export const Overlay = styled(DialogOverlay, {
  backgroundColor: '$overlayBackground',
  backdropFilter: 'blur(8px)',
  position: 'fixed',
  zIndex: 9,
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

export const Content = styled(DialogContent, {
  overflowY: 'scroll',
  backgroundColor: '$appBackground',
  borderRadius: 8,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  zIndex: 10,
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '800px',
  maxHeight: '85vh',
  padding: '2rem',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
})

export const Title = styled(DialogTitle, {
  margin: 0,
  marginBottom: '1rem',
  fontWeight: 500,
  color: '$highContrast',
  fontSize: 18,
})

const shadowMd = '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)'

export const ActionButton = styled('button', {
  padding: '0.5rem 1rem',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  width: 'fit-content',
  variants: {
    primary: {
      true: {
        border: '2px solid $blue9',
        borderRadius: '8px',
        background: '$blue9',
        color: 'white',
        boxShadow: shadowMd,
        '&:hover': {
          backgroundColor: '$blue11',
        },
      },
    },
    color: {
      destructive: {
        backgroundColor: '$errorBackground',
        '&:hover': {
          backgroundColor: '$red11',
        },
        border: '2px solid $errorBackground',
      },
    },
    secondary: {
      true: {
        backgroundColor: 'transparent',
        textDecoration: 'underline',
        outline: 'none',
        border: 'none',
        color: '$sand10',
        textUnderlineThickness: '2px',
        textUnderlineOffset: '4px',
        '&:hover': {
          color: '$sand12',
        },
      },
    },
  },
})

import { Root as ToastRoot, ToastTitle, ToastViewport } from '@radix-ui/react-toast'
import { keyframes } from '@stitches/react'
import { CheckCircleFill, ExclamationTriangleFill, Icon, InfoCircleFill } from 'react-bootstrap-icons'

import { styled } from './stitches.config'

export type ToastVariant = 'info' | 'success' | 'error'
const ToastIcons: {
  [key in ToastVariant as string]: Icon
} = {
  info: InfoCircleFill,
  success: CheckCircleFill,
  error: ExclamationTriangleFill,
}

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + 1.5rem))` },
  to: { transform: 'translateX(0)' },
})

const swipeOut = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + 1.5rem))` },
})

export const Root = styled(ToastRoot, {
  variants: {
    color: Object.fromEntries(Object.keys(ToastIcons).map((type) => [type, { backgroundColor: `$${type}Background` }])),
  },
  borderRadius: 8,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  padding: '1rem',
  display: 'flex',

  '@media (prefers-reduced-motion: no-preference)': {
    '&[data-state="open"]': {
      animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    },
    '&[data-state="closed"]': {
      animation: `${hide} 100ms ease-in forwards`,
    },
    '&[data-swipe="move"]': {
      transform: 'translateX(var(--radix-toast-swipe-move-x))',
    },
    '&[data-swipe="cancel"]': {
      transform: 'translateX(0)',
      transition: 'transform 200ms ease-out',
    },
    '&[data-swipe="end"]': {
      animation: `${swipeOut} 100ms ease-out forwards`,
    },
  },
})

// https://www.radix-ui.com/docs/colors/tests/contrast#aa-large-text
export const ToastIcon = ({ variant }: { variant: ToastVariant }) => {
  const ToastIcon = styled(ToastIcons[variant], {
    fill: 'white',
  })
  return <ToastIcon size={24} />
}

export const Title = styled(ToastTitle, {
  marginLeft: '1rem',
  color: 'white',
  fontWeight: 600,
  fontSize: 14,
})

export const Viewport = styled(ToastViewport, {
  margin: 0,
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  paddingLeft: '2rem',
  width: '15rem',
  'li::before': {
    display: 'none',
  },
})

import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from '@radix-ui/react-scroll-area'
import { styled } from './stitches.config'

export const Container = styled('div', {
  maxWidth: '42rem',
  margin: 'auto',
  padding: '7rem 1rem 0 1rem',
  display: 'flex',
  flexDirection: 'column',
})

export const Button = styled('button', {
  backgroundColor: '$elementBackground',
  color: '$highContrast',
  width: '100%',
  height: '2.75rem',
  border: 'none',
  borderRadius: '0.5rem',
  marginTop: '1rem',
  fontSize: 'medium',
  '&:hover': {
    backgroundColor: '$elementHover',
  },
  '&:active': {
    backgroundColor: '$elementActive',
  },
  variants: {
    icon: {
      true: {
        marginTop: 0,
        width: '2.75rem',
        background: 'none',
      },
    },
  },
})

/* The following code was inspired by the Radix UI scroll area codesandbox:
 * https://codesandbox.io/s/vwrqpu?module=App.js&file=/App.js
 */
export const Area = styled(ScrollArea, {
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
})

export const Viewport = styled(ScrollAreaViewport, {
  height: '100%',
  width: '100%',
  backgroundColor: '$appBackground',
  transition: 'background-color 1s ease-in-out',
})

export const Scrollbar = styled(ScrollAreaScrollbar, {
  display: 'flex',
  userSelect: 'none',
  touchAction: 'none',
  padding: '0.125rem',
  width: '0.75rem',
  backgroundColor: '$subtleBackground',
  marginTop: '4rem',
  transition: 'background-color 1s ease-in-out',
})

export const Thumb = styled(ScrollAreaThumb, {
  flex: 1,
  backgroundColor: '$solidBackground',
  borderRadius: '0.375rem',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: '2.75rem',
    minHeight: '2.75rem',
  },
  '&:hover, &:active': {
    backgroundColor: '$solidHover',
  },
})

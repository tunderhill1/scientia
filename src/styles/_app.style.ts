import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from '@radix-ui/react-scroll-area'
import { styled } from './stitches.config'

export const Container = styled('div', {
  maxWidth: '42rem',
  margin: 'auto',
  padding: '7rem 1rem 0 1rem',
  display: 'flex',
  flexDirection: 'column',
  variants: {
    center: {
      /* Center the content contained within */
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    expand: {
      /* Expand vertically and horizontally to fill the rest of the page */
      true: {
        minHeight: '100vh',
        height: '100%',
        minWidth: '100vw',
        width: '100%',
      },
    },
    dotted: {
      true: {
        $$dotSpace: '1.5rem',
        $$dotSize: '0.0625rem',
        background: `linear-gradient(90deg, $appBackground calc($$dotSpace - $$dotSize), transparent 1%) center,
                     linear-gradient($appBackground calc($$dotSpace - $$dotSize), transparent 1%) center, 
                     $solidBackground`,
        backgroundSize: '$$dotSpace $$dotSpace',
      },
    },
  },
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    active: {
      true: {
        backgroundColor: '$elementBackground',
        '&:hover': { backgroundColor: '$elementHover' },
      },
      false: {
        backgroundColor: '$appBackground',
      },
    },
    /* Press and hold animation */
    animate: {
      true: {
        transition: 'transform 250ms cubic-bezier(.2, .8, .4, 1), background-color 250ms ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
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
})

export const Scrollbar = styled(ScrollAreaScrollbar, {
  display: 'flex',
  userSelect: 'none',
  touchAction: 'none',
  padding: '0.125rem',
  width: '0.75rem',
  backgroundColor: '$subtleBackground',
  marginTop: '4rem',
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

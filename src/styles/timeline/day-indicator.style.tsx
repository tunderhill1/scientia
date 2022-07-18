import { styled } from '../stitches.config'

export const Grid = styled('div', {
  gridArea: 'background',
  zIndex: 2,
  display: 'grid',
  gridTemplateRows: 'auto',
  paddingBottom: '1rem',
})

export const CurrentDayColumn = styled('div', {
  gridRow: 1,
  backgroundColor: '$solidBackground',
  // border: '0.05rem solid $elementBorder'
  visibility: 'hidden',
  variants: {
    visible: {
      true: {
        visibility: 'visible',
      },
    },
  },
})

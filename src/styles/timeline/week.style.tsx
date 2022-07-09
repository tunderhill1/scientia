import { styled } from '../stitches.config'

/* The header contains week information: the number and date range */
export const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  height: '2.75rem',

  backgroundColor: '$elementBackground',
})

/* The content contains the days of the weeks */
export const Content = styled('div', {
  display: 'flex',
  alignItems: 'center',
  height: '2.75rem',
  justifyContent: 'space-evenly',
  // gridTemplateColumns: 'repeat(5, 3rem)',
  // gridTemplateRows: 'auto',
  // placeItems: 'center center',
})

export const Day = styled('div', {
  minWidth: '3rem',
  width: '3rem',
  backgroundColor: 'transparent',
  textAlign: 'center',
  variants: {
    active: {
      true: {
        backgroundColor: '$solidBackground',
        borderRadius: '0.5rem',
      },
    },
  },
})

import { styled } from './stitches.config'

export const Table = styled('table', {
  borderSpacing: '0',
  width: '100%',
})

export const Th = styled('th', {
  variants: {
    expander: {
      true: {
        padding: '1rem 0 1rem 0',
      },
    },
  },
  padding: '1rem 0.5rem 1rem 0.5rem',
  textAlign: 'left',
  borderBottom: '0.1rem solid $sand7',
})

export const ThContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
})

export const Td = styled('td', {
  padding: '0.5rem',
  variants: {
    expander: {
      true: {
        padding: '0.5rem 0 0.5rem 0',
      },
    },
    subRow: {
      true: {
        backgroundColor: '$sand4',
        borderRightColor: '$sand4',
        borderLeftColor: '$sand4',
        paddingLeft: '1.5rem',
      },
    },
  },
})

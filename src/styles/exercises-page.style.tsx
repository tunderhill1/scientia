import { Search } from 'react-bootstrap-icons'

import { css, styled } from './stitches.config'

export const Header = styled('th', {
  textAlign: 'left',
})

export const Pill = styled('p', {
  background: '$blue3',
  fontSize: '14px',
  borderRadius: '16px',
  padding: '4px 12px',
  display: 'inline-block',
  width: 'fit-content',
  margin: 0,
  textAlign: 'center',
})

export const SubText = styled('div', { color: '$sand10', fontSize: '14px' })

const ButtonStyling = {
  width: 'fit-content',
  alignItems: 'center',
  padding: '0.5rem',
  color: '$sand12',
  fill: '$sand12',
  fontWeight: 500,
  fontSize: '16px',
  borderRadius: '8px',
  display: 'inline-flex',
  cursor: 'pointer',
  transition: 'all .1s ease-in',
  border: '2px solid $sand8',
  backgroundColor: 'white',
  '&:hover': {
    background: '$sand4',
  },
  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: '40%',
        '&:hover': {
          background: 'white',
        },
      },
    },
  },
}

export const FeedbackLink = styled('a', ButtonStyling, {
  padding: '0.5rem',
})

export const Table = styled('table', {
  margin: '0 auto',
  alignSelf: 'center',
  borderSpacing: '3rem 2rem',
})

export const HorizontalRow = ({ colSpan }: { colSpan: number }) => (
  <tr>
    <td className={css({ borderBottom: '1px solid $lowContrast' })()} colSpan={colSpan}></td>
  </tr>
)

export const ViewExerciseIcon = styled(Search, {
  fill: 'inherit',
  float: 'left',
  fontWeight: 500,
})

export const ViewExerciseButton = styled('button', ButtonStyling)

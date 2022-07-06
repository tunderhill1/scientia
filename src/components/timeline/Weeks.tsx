import { add } from 'date-fns'
import { Wrapper } from '../../styles/_app.style'
import { Week } from './Week'

export const Weeks = ({ start, weeks }: { start: Date; weeks: number }) => {
  const weeksWrapperStyle = {
    gridArea: 'weeks',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',

    padding: '0rem 1rem',
    overflowX: 'auto',
    overflowY: 'auto',

    backgroundColor: 'transparent',
  }

  return (
    <Wrapper css={weeksWrapperStyle}>
      {[...Array(weeks)].map((_, week) => (
        <Week key={week} start={add(start, { weeks: week })} end={add(start, { weeks: week, days: 4 })} week={week} />
      ))}
    </Wrapper>
  )
}

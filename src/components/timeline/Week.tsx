import { formatDate, toDayCount } from '../../lib/utilities.service'
import { Content, Day, Header } from '../../styles/timeline/week.style'
import { Wrapper } from '../../styles/_app.style'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export const Week = ({ start, end, week }: { start: Date; end: Date; week: number }) => {
  const weekWrapperStyle = {
    width: '15rem',
    height: '4.25rem',
  }

  return (
    <Wrapper css={weekWrapperStyle}>
      <Header>
        <span>Week {week + 1}</span>
        <span>{formatDate(start, end)}</span>
      </Header>
      <Content>
        {days.map((day, i) => (
          <Day key={day} active={toDayCount(start) + i === toDayCount(new Date())}>
            {day}
          </Day>
        ))}
      </Content>
    </Wrapper>
  )
}

import { differenceInDays, nextFriday } from 'date-fns'

import { formatDateRange } from '../../lib/utilities.service'
import { Wrapper } from '../../styles/_app.style'
import { css } from '../../styles/stitches.config'
import { Content, Day, Header } from '../../styles/timeline/week.style'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export const Week = ({ start, week }: { start: Date; week: number }) => (
  <Wrapper
    css={{
      width: '15rem',
      height: '4.25rem',
    }}
  >
    <Header>
      <span>Week {week + 1}</span>
      <span className={css({ color: '$lowContrast' })()}>
        {formatDateRange(start, nextFriday(start))}
      </span>
    </Header>
    <Content>
      {WEEKDAYS.map((day, i) => (
        <Day key={day} active={differenceInDays(start, new Date()) === i}>
          {day}
        </Day>
      ))}
    </Content>
  </Wrapper>
)

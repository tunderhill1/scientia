import { useState } from 'react'
import { CloudDrizzleFill, EggFill, Rainbow, Snow, SunFill, TreeFill } from 'react-bootstrap-icons'
import { mockTimeline } from '../constants/mock'
import {
  Background,
  Modules,
  Switcher,
  SwitcherGroup,
  SwitcherItem,
  TimelineContainer,
  Weeks,
} from '../styles/timeline.style'
import { Container, Wrapper } from '../styles/_app.style'
import { add } from 'date-fns'
import WeekHeading from '../components/WeekHeading'

// Terms from the backend to have the folling shape:
// {
//   name: string,
//   start: date, << --- Monday
//   end: date,   << --- Friday
//   weeks: number << --- Number of Mondays
// }

const defaultTerm = {
  name: 'Autumn term',
  start: new Date(2021, 9, 4),
  end: new Date(2021, 11, 17),
  weeks: 11,
}

/* TODO: Move this into constant folder */
export const landmarks = {
  Term: {
    Autumn: <CloudDrizzleFill size={22} />,
    Spring: <TreeFill size={22} />,
    Summer: <SunFill size={22} />,
  },
  Break: {
    Winter: <Snow size={22} />,
    Easter: <EggFill size={22} />,
    Summer: <Rainbow size={22} />,
  },
}

export const TermSwitcher = ({
  selectedTerm,
  onTermSwitch,
}: {
  selectedTerm: string
  onTermSwitch: (value: string) => void
}) => {
  return (
    <Switcher center>
      <SwitcherGroup
        type="single"
        css={{ maxWidth: '9.75rem', gap: '0.5rem', flexWrap: 'wrap' }}
        defaultValue={selectedTerm}
        onValueChange={onTermSwitch}
      >
        {Object.entries(landmarks).map(([landmark, periods]) =>
          Object.entries(periods).map(([period, icon]) => (
            <SwitcherItem value={period + ' ' + landmark} key={period}>
              {icon}
            </SwitcherItem>
          ))
        )}
      </SwitcherGroup>
    </Switcher>
  )
}

export const WeekHeadings = ({ rangeStart, weeks }: { rangeStart: Date; weeks: number }) => {
  /* Calculate active day here  along with ranges for weeks in between; the weeks would be numbered from 0 for each 
     term to line up with module materials.  */
  return (
    <Weeks css={{ alignItems: 'center', padding: '0rem 1rem' }}>
      {[...Array(weeks)].map((_, week) => (
        <WeekHeading
          key={week}
          dateRangeStart={add(rangeStart, { weeks: week })}
          dateRangeEnd={add(rangeStart, { weeks: week, days: 4 })}
          activeDay={new Date()}
          weekNumber={week}
        />
      ))}
    </Weeks>
  )
}

const Timeline = () => {
  // Fetch from relevant endpoint using the year from the context
  const data = mockTimeline
  const [selectedTerm, setSelectedTerm] = useState<string>('Autumn Term')

  const onTermSwitch = (value: string) => {
    setSelectedTerm(value)
  }

  return (
    <Container expand css={{ padding: 0 }}>
      <TimelineContainer>
        <TermSwitcher selectedTerm={selectedTerm} onTermSwitch={onTermSwitch} />
        <WeekHeadings rangeStart={defaultTerm.start} weeks={defaultTerm.weeks} />
        <Modules />
        <Background as={Wrapper} center>
          <h1>{selectedTerm}</h1>
        </Background>
      </TimelineContainer>
    </Container>
  )
}

export default Timeline

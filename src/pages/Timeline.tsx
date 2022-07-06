import { useState } from 'react'
import { mockTimeline } from '../constants/mock'
import { Background, TimelineContainer } from '../styles/timeline.style'
import { Container, Wrapper } from '../styles/_app.style'
import { Switcher } from '../components/timeline/Switcher'
import { Weeks } from '../components/timeline/Weeks'
import { Modules } from '../components/timeline/Modules'

/**
 * NOTE: Terms from the backend have the following shape.
 * { name: string, start: Date, end: Date, weeks: number }
 * The start date's always a Monday and the end date's always a Friday
 * The weeks holds a count of the number of mondays in the term
 */

const defaultTerm = {
  name: 'Autumn term',
  start: new Date(2021, 9, 4),
  end: new Date(2021, 11, 17),
  weeks: 11,
}

const Timeline = () => {
  const [term, setTerm] = useState<string>('Autumn Term')

  /* TODO: Fetch from the relevant endpoint using the year from the context */
  const data = mockTimeline

  return (
    <Container expand css={{ padding: 0 }}>
      <TimelineContainer>
        <Switcher term={term} onSwitch={setTerm} />
        <Weeks start={defaultTerm.start} weeks={defaultTerm.weeks} />
        <Modules term={term} />
        <Background as={Wrapper} center>
          <h1>{term}</h1>
        </Background>
      </TimelineContainer>
    </Container>
  )
}

export default Timeline

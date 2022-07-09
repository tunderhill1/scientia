import { useState } from 'react'
import { mockTimeline } from '../constants/mock'
import { Background, Grid } from '../styles/timeline.style'
import { Area, Container, Scrollbar, Thumb, Viewport, Wrapper } from '../styles/_app.style'
import { Switcher } from '../components/timeline/Switcher'
import { Weeks } from '../components/timeline/Weeks'
import { Modules } from '../components/timeline/Modules'
import { css } from '../styles/stitches.config'

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
    <Area css={{ height: 'calc(100vh - 5rem)', marginTop: '5rem' }}>
      <Viewport>
        <Container timeline>
          <Switcher term={term} onSwitch={setTerm} />
          <Weeks start={defaultTerm.start} weeks={defaultTerm.weeks} />
          <Modules term={term} />
          <Background>
            <h1>{term}</h1>
          </Background>
          <Grid css={{ gridTemplateColumns: `repeat(${defaultTerm.weeks}, 15rem)` }}>
            {[...Array(11)].map((_, id) => (
              <div
                key={id}
                className={css({ height: `100%`, backgroundColor: '$subtleBackground', borderRadius: '0.5rem' })()}
              />
            ))}
          </Grid>
        </Container>
      </Viewport>
      <Scrollbar orientation="vertical">
        <Thumb />
      </Scrollbar>
      <Scrollbar orientation="horizontal">
        <Thumb />
      </Scrollbar>
    </Area>
  )
}

export default Timeline

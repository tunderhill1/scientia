import { useState } from 'react'
import { mockTimeline } from '../constants/mock'
import { Area, Container, Corner, Scrollbar, Thumb, Viewport } from '../styles/_app.style'
import { Switcher } from '../components/timeline/Switcher'
import { Weeks } from '../components/timeline/Weeks'
import { Modules } from '../components/timeline/Modules'
import { Indicator } from '../components/timeline/Indicator'
import { NAVIGATION_HEIGHT } from '../constants/global'
import { Events } from '../components/timeline/Events'
import { Rows } from '../components/timeline/Rows'

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

/* Top margin to position the scroll area 1rem right under the navigation bar */
const TOP_MARGIN = `(${NAVIGATION_HEIGHT})`

/* The timeline's laid out in four sections: switcher, weeks, modules and main grid. The main grid is a stack of three
 * components: events, indicator and rows; note that the layers are ordered based on their relative heights.
 */
const Timeline = () => {
  const [term, setTerm] = useState<string>('Autumn Term')

  /* TODO: Fetch from the relevant endpoint using the year from the context */
  const data = mockTimeline

  return (
    <Area css={{ height: `calc(100vh - ${TOP_MARGIN})`, marginTop: `calc${TOP_MARGIN}` }}>
      <Viewport css={{ paddingTop: '1rem' }}>
        <Container timeline>
          <Switcher term={term} onSwitch={setTerm} />
          <Weeks start={defaultTerm.start} weeks={defaultTerm.weeks} />
          <Modules term={term} />
          {/* NOTE: Everything under here will be placed in the background area */}
          <Events />
          <Indicator />
          <Rows weeks={defaultTerm.weeks} />
        </Container>
      </Viewport>
      <Scrollbar orientation="vertical">
        <Thumb />
      </Scrollbar>
      <Scrollbar orientation="horizontal">
        <Thumb />
      </Scrollbar>
      <Corner />
    </Area>
  )
}

export default Timeline

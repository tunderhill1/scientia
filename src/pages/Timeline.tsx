import { plainToInstance } from 'class-transformer'
import { useEffect, useState } from 'react'

import { DayIndicator } from '../components/timeline/DayIndicator'
import { Events } from '../components/timeline/Events'
import { MainBackground } from '../components/timeline/MainBackground'
import { Modules } from '../components/timeline/Modules'
import { Switcher } from '../components/timeline/Switcher'
import { Weeks } from '../components/timeline/Weeks'
import {
  COLS_IN_WEEK,
  DAYS_IN_WEEK,
  INDEXING_OFFSET,
  NAVIGATION_HEIGHT,
  TIMELINE_TRACK_HEIGHT,
} from '../constants/global'
import { mockTimeline } from '../constants/mock'
import { Module, Term, TrackMap } from '../constants/types'
import { daysSinceEpoch, generateTrackMap } from '../lib/utilities.service'
import { Area, Container, Corner, Scrollbar, Thumb, Viewport } from '../styles/_app.style'

const defaultTerm: Term = {
  name: 'Autumn term',
  start: new Date(2021, 9, 4),
  end: new Date(2021, 11, 17),
  weeks: 11,
}

export function dateToColumn(date: Date, referenceDate: Date): number {
  if (referenceDate.getDay() !== 1) throw new Error('Parameter referenceDate MUST be a monday.')
  const weeksDelta = Math.floor((daysSinceEpoch(date) - daysSinceEpoch(referenceDate)) / DAYS_IN_WEEK)
  const daysRemainder = (daysSinceEpoch(date) - daysSinceEpoch(referenceDate)) % DAYS_IN_WEEK

  return weeksDelta * COLS_IN_WEEK + daysRemainder + (daysRemainder !== DAYS_IN_WEEK - 1 ? INDEXING_OFFSET : 0)
}

/* Top margin to position the scroll area 1rem right under the navigation bar */
const TOP_MARGIN = `(${NAVIGATION_HEIGHT})`

/* The timeline's laid out in four sections: switcher, weeks, modules and main grid. The main grid is a stack of three
 * components: events, indicator and rows; note that the layers are ordered based on their relative heights.
 */
const Timeline = () => {
  const [modules, setModules] = useState<Module[]>(plainToInstance(Module, mockTimeline))
  const [term, setTerm] = useState<Term>(defaultTerm)
  const [trackMap, setTrackMap] = useState<TrackMap>({})
  const [rowHeights, setRowHeights] = useState<{ [code: string]: string }>({})

  useEffect(() => {
    if (modules !== []) {
      setTrackMap(generateTrackMap(modules))
    }
  }, [modules])

  useEffect(() => {
    const rowHeights = Object.entries(trackMap).reduce(
      (accumulator: { [code: string]: string }, [code, tracks]): { [code: string]: string } => {
        accumulator[code] = `calc(${TIMELINE_TRACK_HEIGHT} * ${tracks.length})`
        return accumulator
      },
      {}
    )
    setRowHeights(rowHeights)
  }, [trackMap])

  function switchTerm(termName: string) {
    // TODO: Look up the term and load the right one here
    setTerm({
      name: termName,
      start: new Date(2021, 9, 4),
      end: new Date(2021, 11, 17),
      weeks: 11,
    })
  }

  return (
    <Area css={{ height: `calc(100vh - ${TOP_MARGIN})`, marginTop: `calc${TOP_MARGIN}` }}>
      <Viewport>
        <Container timeline>
          <Switcher term={term.name} onSwitch={switchTerm} />
          <Weeks start={defaultTerm.start} weeks={defaultTerm.weeks} />
          <Modules modules={modules} term={term.name} rowHeights={rowHeights} />
          {/* NOTE: Everything under here will be placed in the background area */}
          <Events />
          <DayIndicator weeks={term.weeks} currentDayColumn={dateToColumn(new Date(2021, 9, 21), term.start)} />
          <MainBackground cols={defaultTerm.weeks} rowHeights={rowHeights} />
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

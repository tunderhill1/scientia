import { differenceInBusinessDays, differenceInCalendarWeeks, isMonday } from 'date-fns'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import ExerciseDialog from '../components/dialogs/ExerciseDialog'
import { MainBackground } from '../components/timeline/MainBackground'
import { Modules } from '../components/timeline/Modules'
import { Switcher } from '../components/timeline/Switcher'
import { Tracks } from '../components/timeline/Tracks'
import { Weeks } from '../components/timeline/Weeks'
import { INDEXING_OFFSET, NAVIGATION_HEIGHT, TIMELINE_TRACK_HEIGHT } from '../constants/global'
import titles from '../constants/titles'
import { Exercise, Module, Term, TrackMap } from '../constants/types'
import { useTimeline } from '../lib/timeline.service'
import { useUser } from '../lib/user.context'
import {
  generateTrackMap,
  now,
  padForModulesWithNoExercises,
  sortObjectByKey,
} from '../lib/utilities.service'
import { Area, Container, Corner, Scrollbar, Thumb, Viewport } from '../styles/_app.style'

// differenceInCalendarWeeks returns number of weekends in between the 2 dates
export function dateToColumn(date: Date, startDate: Date): number {
  if (!isMonday(startDate)) throw new Error('Parameter startDate MUST be a monday.')
  if (date < startDate) return -1
  return (
    INDEXING_OFFSET +
    differenceInBusinessDays(date, startDate) +
    differenceInCalendarWeeks(date, startDate, { weekStartsOn: 1 })
  )
}

function termToNumber({ name }: Term): number {
  if (name === 'autumn term') return 1
  if (name === 'spring term') return 2
  if (name === 'summer term') return 3
  return -1
}

/* Top margin to position the scroll area 1rem right under the navigation bar */
const TOP_MARGIN = `(${NAVIGATION_HEIGHT})`

/* The timeline's laid out in four sections: switcher, weeks, modules and main grid. The main grid is a stack of three
 * components: events, indicator and rows; note that the layers are ordered based on their relative heights.
 */
const Timeline = () => {
  const { userDetails } = useUser()
  const { terms, exercises } = useTimeline()
  const { year } = useParams()

  const [term, setTerm] = useState<Term>()
  const userModules: Module[] = userDetails?.modules as Module[]
  const [modulesForTerm, setModulesForTerm] = useState<Module[]>([])
  const [trackMapForTerm, setTrackMapForTerm] = useState<TrackMap>({})
  const [rowHeights, setRowHeights] = useState<{ [code: string]: string }>({})
  const [exercise, setExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    if (terms.length > 0) {
      setTerm(terms.find((term: Term) => term.start < now() && term.end > now()) || terms[0])
    }
  }, [terms])

  useEffect(() => {
    if (!term) return

    const moduleCodesForExercisesInTerm = (Object.values(exercises) as Exercise[])
      .flat()
      .filter((e) => e.deadline > term.start && e.startDate < term.end)
      .map((e) => e.moduleCode)

    // For given term, show only modules
    // (a) taught in that term or
    // (b) whose exercises fall within the term's start and end dates.
    const modulesToShow = userModules
      .filter(
        (module) =>
          module.terms.includes(termToNumber(term)) ||
          moduleCodesForExercisesInTerm.includes(module.code)
      )
      .sort((m1, m2) => (m1.code < m2.code ? -1 : 1))
    setModulesForTerm(modulesToShow)

    const moduleCodesForTerm = modulesToShow.map((m) => m.code)
    const trackMap: TrackMap = sortObjectByKey(
      padForModulesWithNoExercises(moduleCodesForTerm, generateTrackMap(exercises, term))
    )
    setTrackMapForTerm(
      Object.fromEntries(
        Object.entries(trackMap).filter(([code, _]) => moduleCodesForTerm.includes(code))
      )
    )
  }, [term, exercises, userModules])

  useEffect(() => {
    setRowHeights(
      Object.entries(trackMapForTerm).reduce(
        (accumulator: { [code: string]: string }, [code, tracks]): { [code: string]: string } => {
          accumulator[code] = `calc(${TIMELINE_TRACK_HEIGHT} * ${tracks.length || 1})`
          return accumulator
        },
        {}
      )
    )
  }, [trackMapForTerm])

  return (
    <>
      <Helmet>
        <title>{titles.timeline(year, term?.name, userDetails?.cohortName)}</title>
      </Helmet>
      {term ? (
        <>
          <Area
            css={{
              height: `calc(100vh - ${TOP_MARGIN})`,
              marginTop: `calc${TOP_MARGIN}`,
            }}
          >
            <Viewport>
              <Container timeline>
                <Switcher term={term.name} setTerm={setTerm} terms={terms} />
                <Weeks start={term.start} weeks={term.weeks} />
                <Modules modules={modulesForTerm} rowHeights={rowHeights} />
                <Tracks
                  term={term}
                  weeks={term.weeks}
                  trackMap={trackMapForTerm}
                  setExercise={setExercise}
                />
                <MainBackground cols={term.weeks} rowHeights={rowHeights} />
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
          {exercise && <ExerciseDialog exercise={exercise} setExercise={setExercise} />}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default Timeline

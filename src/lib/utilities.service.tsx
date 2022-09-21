import { addYears, areIntervalsOverlapping, format, isSameMonth } from 'date-fns'
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz'

import { LONDON_TIMEZONE } from '../constants/global'
import { Exercise, Term, Track, TrackMap } from '../constants/types'

/* A file to store miscellaneous utility functions */

/**
 * Sorts an object alphabetically by key
 */
export const sortObjectByKey = (object: { [_: string]: any }) =>
  Object.keys(object)
    .sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1))
    .reduce((obj: any, key) => {
      obj[key] = object[key]
      return obj
    }, {})

/**
 * Groups a given data object by the given 'groupBy' property to form a dictionary of lists. Each list of objects
 * is sorted by the 'orderBy' property.
 */
export function groupByProperty(
  data: object[],
  groupBy: string,
  orderBy: string,
  sortByKey?: boolean
): { [key: string]: object[] } {
  /* Preliminary check to make sure that the groupBy and orderBy attributes are in the data */
  if (!data.every((d) => groupBy in d && orderBy in d))
    throw Error(`'${groupBy}' and '${orderBy}' need be properties of provided objects`)
  const newObject =
    data === null
      ? {}
      : data
          .sort((a: any, b: any) => (a[orderBy] > b[orderBy] ? 1 : -1))
          .reduce(
            (groups: any, item: any) => ({
              ...groups,
              [item[groupBy]]: [...(groups[item[groupBy]] || []), item],
            }),
            {}
          )
  return sortByKey ? sortObjectByKey(newObject) : newObject
}

/**
 * Compute the current short year (i.e. 2021, 2122, 2223 etc.).
 * It combines the last two digits of each year in the academic year.
 * eg: for the academic year 2021-2022, the short year is 2122
 */
export const currentShortYear = (): string => {
  const OCTOBER = 9
  const now = utcToZonedTime(new Date(), LONDON_TIMEZONE)
  const currentYear = format(now, 'yy')
  const complementYear = format(addYears(now, now.getMonth() < OCTOBER ? -1 : 1), 'yy')
  return now.getMonth() < OCTOBER ? complementYear + currentYear : currentYear + complementYear
}

/* Returns whether the given two exercises overlap */
export const exercisesOverlap = (e1: Exercise, e2: Exercise): boolean =>
  areIntervalsOverlapping(
    { start: e1.startDate, end: e1.endDate },
    { start: e2.startDate, end: e2.endDate }
  )

/* Compute the exercise tracks for the exercises of each module */
export function computeTracks(exercises: Exercise[], term: Term): Track[] {
  /* Pre: Ordering input by the start date */
  const orderedExercises = exercises
    .filter((e) => e.endDate > term.start && e.startDate < term.end)
    .sort((e1, e2) => Number(e1.startDate) - Number(e2.startDate))
  const tracks: Track[] = []
  /* The 'of' is used instead of 'in' to enforce the type of exercise */
  for (const exercise of orderedExercises) {
    let exerciseAssignedToTrack = false
    /* Try to fit the given exercise into one of the tracks */
    for (const track of tracks) {
      if (track.every((trackExercise) => !exercisesOverlap(exercise, trackExercise))) {
        exerciseAssignedToTrack = true
        track.push(exercise)
        break
      }
    }
    /* Create a new track if none of the previous tracks can accommodate the exercise */
    if (!exerciseAssignedToTrack) tracks.push([exercise])
  }
  return tracks
}

/* Creates a track map given a list of modules with exercises */
export function generateTrackMap(exercises: { [code: string]: Exercise[] }, term: Term): TrackMap {
  return sortObjectByKey(
    Object.entries(exercises).reduce((accumulator: TrackMap, [code, exercises]) => {
      accumulator[code] = computeTracks(exercises, term)
      return accumulator
    }, {})
  )
}

/* Formats a date range as "D-D MMM or D MMM-D MMM" */
export const formatDateRange = (start: Date, end: Date): string =>
  format(start, 'd' + (isSameMonth(start, end) ? '' : ' MMM')) + format(end, '-d MMM')

export function displayTimestamp(date: Date | string, format?: string): string {
  return formatInTimeZone(date, LONDON_TIMEZONE, format || 'HH:mm:ss zzz, EEEE d LLLL yyyy')
}

export function percentageToLetterGrade(percentageGrade: number): string {
  if (percentageGrade <= 29) return 'F'
  if (percentageGrade <= 39) return 'E'
  if (percentageGrade <= 49) return 'D'
  if (percentageGrade <= 59) return 'C'
  if (percentageGrade <= 69) return 'B'
  if (percentageGrade <= 79) return 'A'
  return 'A*'
}

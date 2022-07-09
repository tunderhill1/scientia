import { MILLISECONDS_IN_A_DAY } from '../constants/global'
import { Exercise, Track } from '../constants/types'

/* A file to store miscellaneous utility functions */

/**
 * Groups a given data object by the given 'groupBy' property to form a dictionary of lists. Each list of objects
 * is sorted by the 'orderBy' property.
 */
export function groupByProperty(data: object[], groupBy: string, orderBy: string): { [key: string]: object[] } {
  /* Preliminary check to make sure that the groupBy and orderBy attributes are in the data */
  if (!data.every((d) => groupBy in d && orderBy in d))
    throw Error(`'${groupBy}' and '${orderBy}' need be properties of provided objects`)
  return data === null
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
}

/**
 * Compute the current short year (i.e. 2021, 2122, 2223, etc.)
 * A short year is formed by combining the last two digits of each year in the academic year.
 * That is, for the academic year 2021-2022, the short year is 2122
 * NOTE: If we're in 2021, the complement year is 22, and if we're in 2022, then it's 21 instead.
 */
export function currentShortYear(): number {
  /* NOTE: If these constants are needed elsewhere, please move them out to constants/year.ts */
  const MILLENNIUM = 2000
  const SHORT_YEAR_SHIFT = 100 /* To combine 21 and 22 into 2122, 21 * 100 + 22 */
  const OCTOBER = 9

  let currentDate = new Date()
  let currentYear = currentDate.getFullYear() - MILLENNIUM
  let complementYear = currentYear + (currentDate.getMonth() >= OCTOBER ? 1 : -1)

  return currentYear < complementYear
    ? currentYear * SHORT_YEAR_SHIFT + complementYear
    : complementYear * SHORT_YEAR_SHIFT + currentYear
}

/* Compute the number of days practically since the first second of January 2nd 1970 for a given date */
export function daysSinceEpoch(date: Date): number {
  return Math.floor(date.getTime() / MILLISECONDS_IN_A_DAY)
}

/* Returns whether the given two exercises overlap */
export function exercisesOverlap(e1: Exercise, e2: Exercise): boolean {
  return (
    daysSinceEpoch(e1.startDate) <= daysSinceEpoch(e2.endDate) &&
    daysSinceEpoch(e1.endDate) >= daysSinceEpoch(e2.startDate)
  )
}

/* Compute the exercise tracks for the exercises of each module */
export function computeTracks(exercises: Exercise[]): Track[] {
  /* Pre: Ordering input by the start date */
  const orderedExercises = exercises.sort((e1, e2) => daysSinceEpoch(e1.startDate) - daysSinceEpoch(e2.startDate))
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

/* Produces a string with the input start and end dates as "DD/MM - DD/MM" */
export function formatDate(start: Date, end: Date) {
  const TwoDigitDatePeriod = (date: Date, period: string): string => {
    return new Intl.DateTimeFormat('en', {
      [period]: '2-digit',
    }).format(date)
  }
  const startMonth = TwoDigitDatePeriod(start, 'month')
  const startDay = TwoDigitDatePeriod(start, 'day')
  const endMonth = TwoDigitDatePeriod(end, 'month')
  const endDay = TwoDigitDatePeriod(end, 'day')
  return `${startDay}/${startMonth} - ${endDay}/${endMonth}`
}

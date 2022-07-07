/* A file to store miscellaneous utility functions */

/**
 * Groups a given data object by the given 'groupBy' property to form a dictionary of lists. Each list of objects
 * is sorted by the 'orderBy' property. */
export function groupByProperty(data: object[], groupBy: string, orderBy: string): { [key: string]: object[] } {
  if (!data.every((d) => groupBy in d && orderBy in d))
    throw `'${groupBy}' and '${orderBy}' need be properties of provided objects`
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

/* TODO: Document what this function does */
export function toDayCount(date: Date) {
  const milliSecInADay = 86400000
  return Math.floor(date.getTime() / milliSecInADay)
}

/* Produces a string with the input start and end dates as "DD/MM - DD/MM" */
export function formatDate(start: Date, end: Date) {
  const startMonth = new Intl.DateTimeFormat('en', {
    month: '2-digit',
  }).format(start)
  const startDay = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(start)
  const endMonth = new Intl.DateTimeFormat('en', {
    month: '2-digit',
  }).format(end)
  const endDay = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(end)
  return `${startDay}/${startMonth} - ${endDay}/${endMonth}`
}

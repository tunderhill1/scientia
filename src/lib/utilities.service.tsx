/* A file to store miscellaneous utility functions */

/**
 * Groups a given data object by a given property to form a dictionary. Example:
 * data = [{ title: 'a', field: 'n' }, { title: 'b', field: 'm' }]
 * dict = groupByProperty(data) would return { 'a': { field: 'n' }, 'b': { field: 'm' } }
 * NOTE: This assumes that the property chosen doesn't have duplicate values!
 */
export function groupByProperty(data: object[], property: string): { [key: string]: object[] } {
  return data === null
    ? {}
    : data.reduce(
        (groups: any, item: any) => ({
          ...groups,
          [item[property]]: [...(groups[item[property]] || []), item],
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

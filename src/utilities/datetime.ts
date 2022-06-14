const MILLENNIUM = 2000
const SHORT_YEAR_SHIFT = 100
const OCTOBER = 9

export function currentShortYear(): number {
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear() - MILLENNIUM
  let complementYear = currentYear + (currentDate.getMonth() >= OCTOBER ? 1 : -1)
  return currentYear < complementYear
    ? currentYear * SHORT_YEAR_SHIFT + complementYear
    : complementYear * SHORT_YEAR_SHIFT + currentYear
}

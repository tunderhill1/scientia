import {
  formatDateRange,
  formatShortYear,
  shortYear,
  validShortYears,
} from '../../lib/utilities.service'

beforeAll(() => {
  jest.useFakeTimers()
})
afterAll(() => {
  jest.useRealTimers()
})

test.each`
  month | year    | expected
  ${8}  | ${2020} | ${'1920'}
  ${9}  | ${2020} | ${'2021'}
  ${0}  | ${2100} | ${'9900'}
  ${11} | ${2100} | ${'0001'}
`("short year for 1-$month-$year is '$expected'", ({ year, month, expected }) => {
  expect(shortYear(new Date(year, month, 1))).toBe(expected)
})

test('shortYear defaults to current date if no arg is given', () => {
  jest.setSystemTime(new Date(2022, 8, 27))
  expect(shortYear()).toBe('2122')
})

test('format an academic year into a range', () => {
  expect(formatShortYear('2930')).toBe('2029-30')
})

test.each`
  day   | month | year    | expected
  ${1}  | ${2}  | ${2025} | ${['2122', '2223', '2324', '2425']}
  ${26} | ${8}  | ${2022} | ${['2122', '2223']}
  ${26} | ${7}  | ${2022} | ${['2122']}
`(
  'calculates valid short years available on $day-$month-$year',
  ({ day, month, year, expected }) => {
    jest.setSystemTime(new Date(year, month, day))
    expect(validShortYears()).toEqual(expected)
  }
)

test.each`
  start                     | end                     | expected
  ${new Date(2022, 9, 4)}   | ${new Date(2022, 9, 8)} | ${'4-8 Oct'}
  ${new Date(2022, 11, 25)} | ${new Date(2023, 0, 1)} | ${'25 Dec-1 Jan'}
`('can format date range into $expected', ({ start, end, expected }) => {
  expect(formatDateRange(start, end)).toBe(expected)
})

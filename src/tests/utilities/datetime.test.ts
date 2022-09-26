import {
  currentShortYear,
  formatDateRange,
  formatShortYear,
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
  ${9}  | ${2020} | ${'1920'}
  ${10} | ${2020} | ${'2021'}
  ${1}  | ${2100} | ${'9900'}
  ${12} | ${2100} | ${'0001'}
`("short year for 1-$month-$year is '$expected'", ({ year, month, expected }) => {
  jest.setSystemTime(new Date(year, month - 1, 1))
  expect(currentShortYear()).toBe(expected)
})

test('calculates valid short years available', () => {
  jest.setSystemTime(new Date(2025, 2, 1))
  expect(validShortYears()).toEqual(['2122', '2223', '2324', '2425'])
})

test('format an academic year into a range', () => {
  expect(formatShortYear('2930')).toBe('2029 - 30')
})

test.each`
  start                     | end                     | expected
  ${new Date(2022, 9, 4)}   | ${new Date(2022, 9, 8)} | ${'4-8 Oct'}
  ${new Date(2022, 11, 25)} | ${new Date(2023, 0, 1)} | ${'25 Dec-1 Jan'}
`('can format date range into $expected', ({ start, end, expected }) => {
  expect(formatDateRange(start, end)).toBe(expected)
})

import { currentShortYear, formatDateRange } from '../../lib/utilities.service'

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
`('short year for 1/$month/$year is $expected', ({ year, month, expected }) => {
  jest.setSystemTime(new Date(year, month - 1, 1))
  expect(currentShortYear()).toBe(expected)
})

test.each`
  start                     | end                     | expected
  ${new Date(2022, 9, 4)}   | ${new Date(2022, 9, 8)} | ${'4-8 Oct'}
  ${new Date(2022, 11, 25)} | ${new Date(2023, 0, 1)} | ${'25 Dec-1 Jan'}
`('can format date range into $expected', ({ start, end, expected }) => {
  expect(formatDateRange(start, end)).toBe(expected)
})

import { currentShortYear, daysSinceEpoch, formatDate } from '../../lib/utilities.service'

beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})

test.each`
  year    | month | expected
  ${2020} | ${0}  | ${1920}
  ${2020} | ${8}  | ${1920}
  ${2020} | ${9}  | ${2021}
  ${2022} | ${3}  | ${2122}
`('short year for $year/$month is $expected', ({ year, month, expected }) => {
  jest.setSystemTime(new Date(year, month, 1))
  expect(currentShortYear()).toBe(expected)
})

test.each`
  start                     | end                     | expected
  ${new Date(2022, 9, 4)}   | ${new Date(2022, 9, 8)} | ${'04/10 - 08/10'}
  ${new Date(2019, 9, 4)}   | ${new Date(2019, 9, 8)} | ${'04/10 - 08/10'}
  ${new Date(2022, 11, 25)} | ${new Date(2023, 0, 1)} | ${'25/12 - 01/01'}
`('can format date range into $expected', ({ start, end, expected }) => {
  let actual = formatDate(start, end)
  expect(actual).toBe(expected)
})

test.each`
  date                      | expected
  ${new Date(1970, 0, 2)}   | ${0}
  ${new Date(2022, 11, 25)} | ${19351}
`('can calculate number of days since epoch for date', ({ date, expected }) => {
  const actual = daysSinceEpoch(date)
  expect(actual).toBe(expected)
})

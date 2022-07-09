import { currentShortYear, daysSinceEpoch } from '../../lib/utilities.service'

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
  date                      | expected
  ${new Date(1970, 0, 2)}   | ${0}
  ${new Date(2022, 11, 25)} | ${19351}
`('can calculate number of days since epoch for date', ({ date, expected }) => {
  const actual = daysSinceEpoch(date)
  expect(actual).toBe(expected)
})

import { currentShortYear } from '../../utilities/datetime'

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

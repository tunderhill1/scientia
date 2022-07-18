import { dateToColumn } from '../../pages/Timeline'

test.each`
  date                               | expected
  ${new Date(Date.UTC(2022, 9, 31))} | ${27}
  ${new Date(Date.UTC(2022, 8, 30))} | ${-1}
`('can calculate column index from date', ({ date, expected }) => {
  const actual = dateToColumn(date, new Date(Date.UTC(2022, 9, 1)))
  expect(actual).toBe(expected)
})

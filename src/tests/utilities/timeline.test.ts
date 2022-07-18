import { dateToColumn } from '../../pages/Timeline'

test.each`
  date                               | expected
  ${new Date(Date.UTC(2022, 9, 3))}  | ${1}
  ${new Date(Date.UTC(2022, 9, 4))}  | ${2}
  ${new Date(Date.UTC(2022, 9, 8))}  | ${6}
  ${new Date(Date.UTC(2022, 9, 9))}  | ${6}
  ${new Date(Date.UTC(2022, 9, 10))} | ${7}
  ${new Date(Date.UTC(2022, 9, 15))} | ${12}
  ${new Date(Date.UTC(2022, 9, 16))} | ${12}
  ${new Date(Date.UTC(2022, 9, 17))} | ${13}
`('can calculate column index from date', ({ date, expected }) => {
  const actual = dateToColumn(date, new Date(Date.UTC(2022, 9, 3)))
  expect(actual).toBe(expected)
})

test('throws error if referenceDate is not a Monday', () => {
  expect(() => dateToColumn(new Date(), new Date(2022, 9, 5))).toThrowError('Parameter referenceDate MUST be a monday.')
})

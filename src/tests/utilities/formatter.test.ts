import { calculateGrade, capitaliseFirstLetter, percentage } from '../../lib/utilities.service'

test.each([
  ['', ''],
  ['l', 'L'],
  ['lorem', 'Lorem'],
])("capitalises first letter of '%s'", (str, expected) => {
  expect(capitaliseFirstLetter(str)).toBe(expected)
})

test.each([
  [10, 0, ''],
  [-301, 1000, '-31%'],
  [799, 1000, '79%'],
])("floored percentage of %s/%s = '%s'", (mark, maxMark, expected) => {
  expect(percentage(mark, maxMark)).toBe(expected)
})

test.each([
  [10, 0, ''],
  [1, 2, 'C'],
  [799, 1000, 'A'],
])("grade of %s/%s is '%s'", (mark, maxMark, expected) => {
  expect(calculateGrade(mark, maxMark)).toBe(expected)
})

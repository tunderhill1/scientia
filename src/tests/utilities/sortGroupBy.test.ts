import { groupByProperty } from '../../lib/utilities.service'

const dataToGroup = [
  { category: 'category1', index: 34 },
  { category: 'category1', index: 14 },
  { category: 'category1', index: 22 },
  { category: 'category1', index: 1 },
  { category: 'category2', index: 17 },
  { category: 'category2', index: 21 },
  { category: 'category2', index: 0 },
]

test('groups by category and sorts by index', () => {
  const expected = {
    category1: [
      { category: 'category1', index: 1 },
      { category: 'category1', index: 14 },
      { category: 'category1', index: 22 },
      { category: 'category1', index: 34 },
    ],
    category2: [
      { category: 'category2', index: 0 },
      { category: 'category2', index: 17 },
      { category: 'category2', index: 21 },
    ],
  }
  expect(groupByProperty(dataToGroup, 'category', 'index')).toEqual(expected)
})

test.each([
  ['title', 'index'],
  ['category', 'id'],
])("throws error if provided data does not have '%s' or '%s' property", (groupBy, orderBy) => {
  expect(() => groupByProperty(dataToGroup, groupBy, orderBy)).toThrow(
    `'${groupBy}' and '${orderBy}' need be properties of provided objects`
  )
})

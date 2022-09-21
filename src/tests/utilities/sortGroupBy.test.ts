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

test('can sort object keys alphabetically', () => {
  const values = [
    { category: 'week 4', index: 21 },
    { category: 'Cat 10', index: 14 },
    { category: 'misc stuff', index: 22 },
    { category: 'Lecture Notes', index: 1 },
    { category: '1st week', index: 17 },
  ]
  expect(groupByProperty(values, 'category', 'index', true)).toEqual({
    '1st week': [{ category: '1st week', index: 17 }],
    'Cat 10': [{ category: 'Cat 10', index: 14 }],
    'Lecture Notes': [{ category: 'Lecture Notes', index: 1 }],
    'misc stuff': [{ category: 'misc stuff', index: 22 }],
    'week 4': [{ category: 'week 4', index: 21 }],
  })
})

test.each([
  ['title', 'index'],
  ['category', 'id'],
])("throws error if provided data does not have '%s' or '%s' property", (groupBy, orderBy) => {
  expect(() => groupByProperty(dataToGroup, groupBy, orderBy)).toThrow(
    `'${groupBy}' and '${orderBy}' need be properties of provided objects`
  )
})

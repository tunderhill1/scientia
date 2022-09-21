import { Exercise, Term, Track, TrackMap } from '../../constants/types'
import { computeTracks, exercisesOverlap, generateTrackMap } from '../../lib/utilities.service'

const EXERCISE_TEMPLATE: Exercise = {
  number: 1,
  title: 'Task 1',
  type: 'CW',
  owner: 'rbc',
  estimatedWorkHours: 6,
  submissionType: 'individual',
  startDate: new Date(2022, 9, 11, 9),
  endDate: new Date(2022, 9, 29, 19),
  moduleCode: '40001',
  moduleName: 'Lab 2',
  mark: null,
  maximumMark: 100,
}

const TERM: Term = {
  start: new Date(2022, 8, 29),
  end: new Date(2022, 11, 25),
  name: 'autumn term',
  weeks: 11,
}

const reference = {
  ...EXERCISE_TEMPLATE,
  startDate: new Date(2022, 9, 1),
  endDate: new Date(2022, 9, 10),
}
const overlapping = {
  ...EXERCISE_TEMPLATE,
  startDate: new Date(2022, 9, 5),
  endDate: new Date(2022, 9, 15),
}
const preceding = {
  ...EXERCISE_TEMPLATE,
  startDate: new Date(2022, 8, 25),
  endDate: new Date(2022, 8, 30),
}
const following = {
  ...EXERCISE_TEMPLATE,
  startDate: new Date(2022, 9, 11),
  endDate: new Date(2022, 9, 15),
}

test.each([
  [reference, overlapping, true],
  [reference, preceding, false],
  [reference, following, false],
])('can identify overlapping exercises', (exercise1, exercise2, expected) => {
  expect(exercisesOverlap(exercise1, exercise2)).toBe(expected)
})

test('computes the right tracks for set of exercise', () => {
  const actual = computeTracks([preceding, overlapping, reference, following], TERM)
  const expected: Track[] = [[preceding, reference, following], [overlapping]]
  expect(actual).toEqual(expected)
})

const inputModules: { [code: string]: Exercise[] } = {
  '50007.1': [
    {
      ...EXERCISE_TEMPLATE,
      title: 'Pintos Task 1',
      startDate: new Date(Date.UTC(2022, 9, 11, 12)),
      endDate: new Date(Date.UTC(2022, 9, 29, 19)),
    },
    {
      ...EXERCISE_TEMPLATE,
      title: 'Pintos Task 2',
      startDate: new Date(Date.UTC(2022, 10, 1, 12)),
      endDate: new Date(Date.UTC(2022, 10, 19, 19)),
    },
  ],
  '50002': [
    {
      ...EXERCISE_TEMPLATE,
      title: 'TDD',
      startDate: new Date(Date.UTC(2022, 9, 11, 12)),
      endDate: new Date(Date.UTC(2022, 9, 29, 19)),
    },
    {
      ...EXERCISE_TEMPLATE,
      title: 'Mockery',
      startDate: new Date(Date.UTC(2022, 9, 28, 12)),
      endDate: new Date(Date.UTC(2022, 10, 5, 19)),
    },
  ],
}

test('computes the right track map for set of modules', () => {
  const expected: TrackMap = {
    '50007.1': [
      [
        {
          ...EXERCISE_TEMPLATE,
          title: 'Pintos Task 1',
          startDate: new Date(Date.UTC(2022, 9, 11, 12)),
          endDate: new Date(Date.UTC(2022, 9, 29, 19)),
        },
        {
          ...EXERCISE_TEMPLATE,
          title: 'Pintos Task 2',
          startDate: new Date(Date.UTC(2022, 10, 1, 12)),
          endDate: new Date(Date.UTC(2022, 10, 19, 19)),
        },
      ],
    ],
    '50002': [
      [
        {
          ...EXERCISE_TEMPLATE,
          title: 'TDD',
          startDate: new Date(Date.UTC(2022, 9, 11, 12)),
          endDate: new Date(Date.UTC(2022, 9, 29, 19)),
        },
      ],
      [
        {
          ...EXERCISE_TEMPLATE,
          title: 'Mockery',
          startDate: new Date(Date.UTC(2022, 9, 28, 12)),
          endDate: new Date(Date.UTC(2022, 10, 5, 19)),
        },
      ],
    ],
  }
  let actual = generateTrackMap(inputModules, TERM)
  expect(actual).toEqual(expected)
})

const insideTerm = {
  ...EXERCISE_TEMPLATE,
  startDate: new Date(2022, 9, 10),
  endDate: new Date(2022, 9, 15),
}
const acrossTerm = {
  ...EXERCISE_TEMPLATE,
  startDate: new Date(2022, 11, 20),
  endDate: new Date(2023, 0, 5),
}
const outsideTerm = {
  ...EXERCISE_TEMPLATE,
  startDate: new Date(2023, 1, 25),
  endDate: new Date(2023, 1, 30),
}

test('excludes exercises outside of term', () => {
  const expected: Track[] = [[insideTerm, acrossTerm]]
  const actual = computeTracks([insideTerm, outsideTerm, acrossTerm], TERM)
  expect(actual).toEqual(expected)
})

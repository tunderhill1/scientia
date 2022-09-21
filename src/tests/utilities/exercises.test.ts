import { Exercise, Track, TrackMap } from '../../constants/types'
import { computeTracks, exercisesOverlap, generateTrackMap } from '../../lib/utilities.service'

const ExerciseFactory = ({
  number = 1,
  title = 'Exercise Title',
  type = 'CW',
  submissionType = 'individual',
  startDate = new Date(2022, 9, 11, 9),
  endDate = new Date(2022, 9, 29, 19),
  estimatedWorkHours = 6,
}: {
  number?: number
  title?: string
  type?: string
  submissionType?: string
  startDate?: Date
  endDate?: Date
  estimatedWorkHours?: number
}): Exercise => {
  let exercise = new Exercise()
  exercise.number = number
  exercise.title = title
  exercise.type = type
  exercise.submissionType = submissionType
  exercise.startDate = startDate
  exercise.endDate = endDate
  exercise.estimatedWorkHours = estimatedWorkHours
  return exercise
}

const TERM = {
  start: new Date(2022, 8, 29),
  end: new Date(2022, 11, 25),
  name: 'autumn term',
  weeks: 11,
}

const reference = ExerciseFactory({
  startDate: new Date(2022, 9, 1),
  endDate: new Date(2022, 9, 10),
})
const overlapping = ExerciseFactory({
  startDate: new Date(2022, 9, 5),
  endDate: new Date(2022, 9, 15),
})
const preceding = ExerciseFactory({
  startDate: new Date(2022, 8, 25),
  endDate: new Date(2022, 8, 30),
})
const following = ExerciseFactory({
  startDate: new Date(2022, 9, 11),
  endDate: new Date(2022, 9, 15),
})

test.each([
  [reference, overlapping, true],
  [reference, preceding, false],
  [reference, following, false],
])('can identify overlapping exercises', (firstExercise, secondExercise, expected) => {
  let actual = exercisesOverlap(firstExercise, secondExercise)
  expect(actual).toBe(expected)
})

test('computes the right tracks for set of exercise', () => {
  const expected: Track[] = [[preceding, reference, following], [overlapping]]
  let actual = computeTracks([preceding, overlapping, reference, following], TERM)
  expect(actual).toEqual(expected)
})

const inputModules = {
  '50007.1': [
    {
      owner: 'rbc',
      number: 4,
      title: 'Pintos Task 1 - Scheduling',
      type: 'CW',
      startDate: new Date(Date.UTC(2022, 9, 11, 12)),
      endDate: new Date(Date.UTC(2022, 9, 29, 19)),
      submissionType: 'group',
      estimatedWorkHours: 6,
    },
    {
      owner: 'rbc',
      number: 5,
      title: 'Pintos Task 2 - User Programs',
      type: 'CW',
      startDate: new Date(Date.UTC(2022, 10, 1, 12)),
      endDate: new Date(Date.UTC(2022, 10, 19, 19)),
      submissionType: 'group',
      estimatedWorkHours: 6,
    },
  ],
  '50002': [
    {
      owner: 'rbc',
      number: 1,
      title: 'TDD',
      type: 'CW',
      startDate: new Date(Date.UTC(2022, 9, 11, 12)),
      endDate: new Date(Date.UTC(2022, 9, 29, 19)),
      submissionType: 'group',
      estimatedWorkHours: 6,
    },
    {
      owner: 'rbc',
      number: 2,
      title: 'Mockery',
      type: 'CW',
      startDate: new Date(Date.UTC(2022, 9, 28, 12)),
      endDate: new Date(Date.UTC(2022, 10, 5, 19)),
      submissionType: 'group',
      estimatedWorkHours: 6,
    },
  ],
}

test('computes the right track map for set of modules', () => {
  const expected: TrackMap = {
    '50007.1': [
      [
        {
          owner: 'rbc',
          number: 4,
          title: 'Pintos Task 1 - Scheduling',
          type: 'CW',
          startDate: new Date(Date.UTC(2022, 9, 11, 12)),
          endDate: new Date(Date.UTC(2022, 9, 29, 19)),
          submissionType: 'group',
          estimatedWorkHours: 6,
        },
        {
          owner: 'rbc',
          number: 5,
          title: 'Pintos Task 2 - User Programs',
          type: 'CW',
          startDate: new Date(Date.UTC(2022, 10, 1, 12)),
          endDate: new Date(Date.UTC(2022, 10, 19, 19)),
          submissionType: 'group',
          estimatedWorkHours: 6,
        },
      ],
    ],
    '50002': [
      [
        {
          owner: 'rbc',
          number: 1,
          title: 'TDD',
          type: 'CW',
          startDate: new Date(Date.UTC(2022, 9, 11, 12)),
          endDate: new Date(Date.UTC(2022, 9, 29, 19)),
          submissionType: 'group',
          estimatedWorkHours: 6,
        },
      ],
      [
        {
          owner: 'rbc',
          number: 2,
          title: 'Mockery',
          type: 'CW',
          startDate: new Date(Date.UTC(2022, 9, 28, 12)),
          endDate: new Date(Date.UTC(2022, 10, 5, 19)),
          submissionType: 'group',
          estimatedWorkHours: 6,
        },
      ],
    ],
  }
  let actual = generateTrackMap(inputModules, TERM)
  expect(actual).toEqual(expected)
})

const insideTerm = ExerciseFactory({
  startDate: new Date(2022, 9, 10),
  endDate: new Date(2022, 9, 15),
})
const acrossTerm = ExerciseFactory({
  startDate: new Date(2022, 11, 20),
  endDate: new Date(2023, 0, 5),
})
const outsideTerm = ExerciseFactory({
  startDate: new Date(2023, 1, 25),
  endDate: new Date(2023, 1, 30),
})

test('excludes exercises outside of term', () => {
  const expected: Track[] = [[insideTerm, acrossTerm]]
  const actual = computeTracks([insideTerm, outsideTerm, acrossTerm], TERM)
  expect(actual).toEqual(expected)
})

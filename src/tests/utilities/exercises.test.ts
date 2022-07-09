import { Exercise, Track } from '../../constants/types'
import { computeTracks, exercisesOverlap } from '../../lib/utilities.service'

const ExerciseFactory = ({
  number = 1,
  title = 'Exercise Title',
  type = 'CW',
  submissionType = 'individual',
  startDate = new Date(2022, 9, 11, 9),
  endDate = new Date(2022, 9, 29, 19),
}: {
  number?: number
  title?: string
  type?: string
  submissionType?: string
  startDate?: Date
  endDate?: Date
}): Exercise => {
  let exercise = new Exercise()
  exercise.number = number
  exercise.title = title
  exercise.type = type
  exercise.submissionType = submissionType
  exercise.startDate = startDate
  exercise.endDate = endDate
  return exercise
}

const reference = ExerciseFactory({ startDate: new Date(2022, 9, 1), endDate: new Date(2022, 9, 10) })
const overlapping = ExerciseFactory({ startDate: new Date(2022, 9, 5), endDate: new Date(2022, 9, 15) })
const preceding = ExerciseFactory({ startDate: new Date(2022, 8, 25), endDate: new Date(2022, 8, 30) })
const following = ExerciseFactory({ startDate: new Date(2022, 9, 11), endDate: new Date(2022, 9, 15) })

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
  let actual = computeTracks([preceding, overlapping, reference, following])
  expect(actual).toEqual(expected)
})

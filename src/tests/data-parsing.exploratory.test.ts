import { plainToInstance } from 'class-transformer'
import { Exercise, Module } from '../constants/types'

test('can parse Date correctly from string', () => {
  const rawExercise = {
    number: 4,
    title: 'Pintos Task 1 - Scheduling',
    type: 'CW',
    start_date: '2021-10-11T12:00:00Z',
    end_date: '2021-10-29T19:00:00Z',
    submission_type: 'group',
  }
  const expectedExercise = {
    number: 4,
    title: 'Pintos Task 1 - Scheduling',
    type: 'CW',
    startDate: new Date(Date.UTC(2021, 9, 11, 12)),
    endDate: new Date(Date.UTC(2021, 9, 29, 19)),
    submissionType: 'group',
  }

  let actual = plainToInstance(Exercise, rawExercise)
  expect(actual).toEqual(expectedExercise)
})

test('can parse module with nested exercises correctly', () => {
  const rawModule = {
    code: '50007.1',
    title: 'Laboratory 2',
    terms: [1],
    staff: [],
    exercises: [
      {
        number: 4,
        title: 'Pintos Task 1 - Scheduling',
        type: 'CW',
        start_date: '2021-10-11T12:00:00Z',
        end_date: '2021-10-29T19:00:00Z',
        submission_type: 'group',
      },
      {
        number: 5,
        title: 'Pintos Task 2 - User Programs',
        type: 'CW',
        start_date: '2021-11-01T12:00:00Z',
        end_date: '2021-11-19T19:00:00Z',
        submission_type: 'group',
      },
    ],
  }
  const expectedModule = {
    code: '50007.1',
    title: 'Laboratory 2',
    terms: [1],
    staff: [],
    exercises: [
      {
        number: 4,
        title: 'Pintos Task 1 - Scheduling',
        type: 'CW',
        startDate: new Date(Date.UTC(2021, 9, 11, 12)),
        endDate: new Date(Date.UTC(2021, 9, 29, 19)),
        submissionType: 'group',
      },
      {
        number: 5,
        title: 'Pintos Task 2 - User Programs',
        type: 'CW',
        startDate: new Date(Date.UTC(2021, 10, 1, 12)),
        endDate: new Date(Date.UTC(2021, 10, 19, 19)),
        submissionType: 'group',
      },
    ],
  }

  let actual = plainToInstance(Module, rawModule)
  expect(actual).toEqual(expectedModule)
})

/**
 * A file dedicated to hosting mock data used for setting up interface layouts.
 * NOTE: Please use the toggles in the gutter (on an IDE) to make file navigation easier.
 */

/**
 * Mock materials based on the Software Engineering Design module; the schema is detailed in the first example
 * NOTE: Please refer to materials/app/schema/teaching_resource.py for more information.
 */
export const mockMaterials = [
  {
    id: 0 /* Unique identifier of resource in a module */,
    index: 0 /* Index of resource in a category (for ordering) */,
    path: '' /* A URL path for a resource of type "link" */,
    title: 'Lecture 1 (Introduction and TDD)',
    year: '2021',
    course: '50002',
    category: 'Lecture Notes',
    type: 'file' /* One of "link" or "file" */,
    tags: 'Week 1' /* semicolon delimited string of tags */,
    downloads: 0 /* Number of times the resource has been downloaded (analytics) */,
    visible_after: '2022-06-27T19:24:01.459Z',
  },
  {
    id: 1,
    index: 1,
    path: '',
    title: 'Lecture 2 (Refactoring)',
    year: '2021',
    course: '50002',
    category: 'Lecture Notes',
    type: 'file',
    tags: 'Week 1',
    downloads: 0,
    visible_after: '2022-06-27T19:24:01.459Z',
  },
  {
    id: 2,
    index: 2,
    path: '',
    title: 'Lecture 3 (Mock Objects)',
    year: '2021',
    course: '50002',
    category: 'Lecture Notes',
    type: 'file',
    tags: 'Week 2',
    downloads: 0,
    visible_after: '2022-06-27T19:24:01.459Z',
  },
  {
    id: 3,
    index: 0,
    path: 'https://imperial.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=29630189-cfc6-451b-af15-adb5012be883',
    title: 'Course Introduction',
    year: '2021',
    course: '50002',
    category: 'Lectures',
    type: 'link',
    tags: 'Video',
    downloads: 0,
    visible_after: '2022-06-27T19:24:01.459Z',
  },
]

/**
 * Mock data for the timeline from 50007.1 and 50002; the schema is detailed in the first example
 * However, the staff section is temporarily omitted as we currently don't have a use for it.
 * NOTE: Please refer to abc-api/app/schemas/cate/exercise.py
 *                       abc-api/app/schemas/teachdb/module.py
 * TODO: Add overlapping events to test layout and spacing on the event grid!
 */
export const mockTimeline = [
  {
    code: '50007.1',
    title: 'Laboratory 2',
    terms: [1] /* A list of ints where Autumn (1), Spring (2) and Summer (3) */,
    staff: [] /* Temporarily omitted */,
    exercises: [
      {
        number: 4 /* Unique identifier for a module exercise */,
        title: 'Pintos Task 1 - Scheduling',
        type: 'CW' /* Interestingly, there's no locked values for this (e.g. include PMT, PPT, CDT, WES, etc.) */,
        start_date: '2021-10-11T12:00:00Z',
        end_date: '2021-10-29T19:00:00Z',
        submission_type: 'group' /* One of "no submission required", "individual" or "group" */,
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
  },
  {
    code: '50002',
    title: 'Software Engineering Design',
    terms: [1, 2],
    staff: [] /* Temporarily omitted */,
    exercises: [
      {
        number: 1,
        title: 'Test Driven Development',
        type: 'CW',
        start_date: '2021-10-11T12:00:00Z',
        end_date: '2021-10-14T19:00:00Z',
        submission_type: 'individual',
      },
      {
        number: 2,
        title: 'Mock Objects',
        type: 'CW',
        start_date: '2021-10-18T12:00:00Z',
        end_date: '2021-10-21T19:00:00Z',
        submission_type: 'individual',
      },
    ],
  },
]

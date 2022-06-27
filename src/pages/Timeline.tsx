import { Container } from '../styles/_app.style'
import { Background, Modules, Switcher, Weeks, TimelineContainer } from '../styles/timeline.style'

const mockData = [
  {
    code: '50007.1',
    title: 'Laboratory 2',
    terms: [1],
    staff: [],
    exercises: [
      {
        number: 4,
        title: 'Pintos Task 1 - Scheduling',
        type: 'CW',
        start_date: '2021-10-11',
        end_date: '2021-10-29',
        submission_type: 'individual',
      },
      {
        number: 5,
        title: 'Pintos Task 2 - User Programs',
        type: 'CW',
        start_date: '2021-11-01',
        end_date: '2021-11-19',
        submission_type: 'individual',
      },
    ],
  },
  {
    code: '50002',
    title: 'Software Engineering Design',
    terms: [1, 2],
    staff: [],
    exercises: [
      {
        number: 1,
        title: 'Camera',
        type: 'CW',
        start_date: '2021-10-09',
        end_date: '2021-10-14',
        submission_type: 'individual',
      },
      {
        number: 2,
        title: 'Singleton Pattern',
        type: 'CW',
        start_date: '2022-01-15',
        end_date: '2022-01-20',
        submission_type: 'individual',
      },
    ],
  },
]

const Timeline = () => {
  // Fetch from relevant endpoint using the year from the context
  const data = mockData

  return (
    <Container expand>
      <TimelineContainer>
        <Switcher />
        <Weeks />
        <Modules />
        <Background />
      </TimelineContainer>
    </Container>
  )
}

export default Timeline

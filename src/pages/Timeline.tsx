import { Container } from '../styles/_app.style'
import { Background, Modules, Switcher, Weeks, TimelineContainer } from '../styles/timeline.style'
import { mockTimeline } from '../constants/mock'

const Timeline = () => {
  // Fetch from relevant endpoint using the year from the context
  const data = mockTimeline

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

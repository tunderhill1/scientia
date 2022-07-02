import { useState } from 'react'
import { CloudDrizzleFill, EggFill, Rainbow, Snow, SunFill, TreeFill } from 'react-bootstrap-icons'
import { mockTimeline } from '../constants/mock'
import {
  Background,
  Modules,
  Switcher,
  SwitcherGroup,
  SwitcherItem,
  TimelineContainer,
  Weeks,
} from '../styles/timeline.style'
import { Container, Wrapper } from '../styles/_app.style'

/* TODO: Move this into constant folder */
export const landmarks = {
  Term: {
    Autumn: <CloudDrizzleFill size={22} />,
    Spring: <TreeFill size={22} />,
    Summer: <SunFill size={22} />,
  },
  Break: {
    Winter: <Snow size={22} />,
    Easter: <EggFill size={22} />,
    Summer: <Rainbow size={22} />,
  },
}

export const TermSwitcher = ({
  selectedTerm,
  onTermSwitch,
}: {
  selectedTerm: string
  onTermSwitch: (value: string) => void
}) => {
  return (
    <Switcher center>
      <SwitcherGroup
        type="single"
        css={{ maxWidth: '9.75rem', gap: '0.5rem', flexWrap: 'wrap' }}
        defaultValue={selectedTerm}
        onValueChange={onTermSwitch}
      >
        {Object.entries(landmarks).map(([landmark, periods]) =>
          Object.entries(periods).map(([period, icon]) => (
            <SwitcherItem value={period + ' ' + landmark} key={period}>
              {icon}
            </SwitcherItem>
          ))
        )}
      </SwitcherGroup>
    </Switcher>
  )
}

const Timeline = () => {
  // Fetch from relevant endpoint using the year from the context
  const data = mockTimeline
  const [selectedTerm, setSelectedTerm] = useState<string>('Autumn Term')

  const onTermSwitch = (value: string) => {
    setSelectedTerm(value)
  }

  return (
    <Container expand css={{ padding: 0 }}>
      <TimelineContainer>
        <TermSwitcher selectedTerm={selectedTerm} onTermSwitch={onTermSwitch} />
        <Weeks />
        <Modules />
        <Background as={Wrapper} center>
          <h1>{selectedTerm}</h1>
        </Background>
      </TimelineContainer>
    </Container>
  )
}

export default Timeline

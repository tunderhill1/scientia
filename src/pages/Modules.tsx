import { useContext, useRef, useState } from 'react'
import { endpoints } from '../constants/endpoints'
import useAuth from '../lib/auth.service'
import { useAxios } from '../lib/axios.context'
import { ThemeContext } from '../lib/theme.context'
import { Button, Container, Tab, TabsHighlight, TabsWrapper } from '../styles/_app.style'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

const Modules = () => {
  const { logoutUser } = useAuth()
  const { data } = useAxios(endpoints.courses('2021'), 'GET')

  /* TODO: Extract this into a separate component */
  const [tabBoundingBox, setTabBoundingBox] = useState<any>(null)
  const [wrapperBoundingBox, setWrapperBoundingBox] = useState<any>(null)
  const [highlightedTab, setHighlightedTab] = useState(null)
  const [isHoveredFromNull, setIsHoveredFromNull] = useState(true)

  const highlightRef = useRef(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const highlightStyles: any = {}

  const resetHighlight = () => setHighlightedTab(null)
  const repositionHighlight = (e: any, tab: any) => {
    setTabBoundingBox(e.currentTarget.getBoundingClientRect())
    setWrapperBoundingBox(wrapperRef.current?.getBoundingClientRect())
    setIsHoveredFromNull(!highlightedTab)
    setHighlightedTab(tab)
  }

  /* TODO: Update this to translate along both x and y according to the user preference */
  if (tabBoundingBox && wrapperBoundingBox) {
    highlightStyles.transitionDuration = isHoveredFromNull ? '0ms' : '150ms'
    highlightStyles.opacity = highlightedTab ? 0.3 : 0
    highlightStyles.width = `${tabBoundingBox.width}px`
    highlightStyles.transform = `translate(0, ${tabBoundingBox.top - wrapperBoundingBox.top}px)`
  }

  return (
    <Container>
      <section style={{ marginBottom: '0.5rem' }}>
        <h1 style={{ marginBottom: '1rem', fontWeight: '600', letterSpacing: '-0.5' }}>Modules</h1>
        <p style={{ marginBottom: '1rem' }}>
          These are the modules you are currently enrolled for. Click on any to access the relevant teaching materials
          and resources. A yellow dot indicates that a module's under construction and doesn't house any resources at
          the moment.
        </p>
      </section>

      {/* TODO: Extract this into a separate component */}
      <TabsWrapper ref={wrapperRef} onMouseLeave={resetHighlight}>
        <TabsHighlight ref={highlightRef} css={highlightStyles} />
        {data &&
          data.map((tab: any) => (
            <Tab key={tab.title} onMouseOver={(event: any) => repositionHighlight(event, tab)} href="/">
              {/* NOTE: Modularity applies when a custom component can be passed in here */}
              <span>{tab.title}</span>
              <span>{tab.code}</span>
            </Tab>
          ))}
      </TabsWrapper>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
        <ToggleTheme />
        <Button
          onClick={() => {
            logoutUser()
          }}
        >
          Logout
        </Button>
      </div>
    </Container>
  )
}

export default Modules

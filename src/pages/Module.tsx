import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Button, Container } from '../styles/_app.style'
import { css } from '../styles/stitches.config'

const Module = () => {
  const { moduleCode } = useParams()
  const { pathname } = useLocation()
  const [moduleTitle, setModuleTitle] = useState<string>('')
  const navigate = useNavigate()

  /* TODO: Remove hacky localStorage fix to get the module titles working */
  useEffect(() => {
    let data = JSON.parse(window.localStorage.getItem('modules') ?? '')
    data = data.filter((module: any) => module.code === moduleCode)
    setModuleTitle(data[0].title) /* Not a good assumption! */
  }, [moduleCode])

  const tabs = [
    { title: 'Materials', to: 'materials' },
    { title: 'Exercises', to: 'exercises' },
  ]

  return (
    <Container>
      <h1 style={{ margin: 0 }}> {moduleTitle}</h1>
      <h3 className={css({ color: '$lowContrast', margin: '0.5rem 0rem', marginBottom: '1rem', fontWeight: '400' })()}>
        {moduleCode}
      </h3>
      {/* TODO: Introduce module leader information or overview here when the data is available */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {tabs.map((tab) => (
          <Button
            key={tab.title}
            css={{ minWidth: '9rem', flex: '1 1 9rem', margin: 0 }}
            active={RegExp(`.*/${tab.to}`).test(pathname)}
            onClick={() => navigate(tab.to)}
            animate
          >
            {tab.title}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', minHeight: '10rem' }}>
        <Outlet context={moduleCode} />
      </div>
    </Container>
  )
}

export default Module

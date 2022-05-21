import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { css } from '../styles/stitches.config'
import { Button, Container } from '../styles/_app.style'

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
      <p style={{ marginBottom: '0.5rem' }}>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
        corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
        culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
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

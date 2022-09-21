import { plainToInstance } from 'class-transformer'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'

import { LevelProgressBar } from '../components/game/LevelProgressBar'
import { endpoints } from '../constants/endpoints'
import { Module as ModuleType } from '../constants/types'
import { useAxios } from '../lib/axios.context'
import { useGame } from '../lib/game/game.context'
import { useLevels } from '../lib/game/levels.service'
import { useYear } from '../lib/year.context'
import { Button, Container, Wrapper } from '../styles/_app.style'
import { css } from '../styles/stitches.config'

const Module = () => {
  const { includeLevels } = useGame()
  const { moduleCode } = useParams()
  const levelsManager = useLevels()
  const { pathname } = useLocation()
  const { year } = useYear()
  const [module, setModule] = useState<ModuleType | undefined>(undefined)
  const { data, error } = useAxios({
    url: endpoints.module(year, moduleCode as string),
    method: 'GET',
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (data !== null) setModule(plainToInstance(ModuleType, data))
  }, [data])

  const tabs = [
    { title: 'Materials', to: 'materials' },
    { title: 'Exercises', to: 'exercises' },
  ]

  if (module === undefined) {
    return (
      <Container>
        <h1 style={{ margin: 0 }}> {moduleCode}</h1>
        <p style={{ marginBottom: '0.5rem' }}>{error}</p>
      </Container>
    )
  }

  return (
    <Container>
      <Wrapper inline>
        <h1 style={{ width: '100%', margin: 0 }}> {module.title}</h1>
        {includeLevels && RegExp('.*/materials').test(pathname) && levelsManager.loaded && (
          <LevelProgressBar level={levelsManager.level} progress={levelsManager.progress} />
        )}
      </Wrapper>
      <h3
        className={css({
          color: '$lowContrast',
          margin: '0.5rem 0rem',
          marginBottom: '1rem',
          fontWeight: '400',
        })()}
      >
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
      <div style={{ display: 'flex', minHeight: '10rem', justifyContent: 'center' }}>
        <Outlet context={{ moduleCode, levelsManager }} />
      </div>
    </Container>
  )
}

export default Module

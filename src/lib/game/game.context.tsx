import React, { createContext, useContext, useEffect, useState } from 'react'

import { useUser } from '../user.context'
import { gameEnabled } from './levels.service'

type GameProviderType = {
  includeLevels: boolean
  toggleIncludeLevels: () => void
}

const defaultGame = {
  includeLevels: false,
  toggleIncludeLevels: () => {},
}

export const GameContext = createContext<GameProviderType>(defaultGame)

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { userDetails } = useUser()
  const [includeLevels, setIncludeLevels] = useState(defaultGame.includeLevels)

  useEffect(() => {
    const storedIncludeLevels = localStorage.getItem('includeLevels')
    if (storedIncludeLevels) {
      setIncludeLevels(storedIncludeLevels === 'true')
    }
  }, [])

  const toggleIncludeLevels = () => {
    if (userDetails?.isStaff()) throw new Error('Staff should NOT toggle game levels')
    setIncludeLevels(!includeLevels)
    localStorage.setItem('includeLevels', (!includeLevels).toString())
  }

  /* We do not include game levels for staff as it may be unintuitive when uploading files */
  return (
    <GameContext.Provider
      value={{
        includeLevels: gameEnabled && !userDetails?.isStaff() && includeLevels,
        toggleIncludeLevels,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)

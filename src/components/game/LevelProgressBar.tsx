import { useEffect, useRef, useState } from 'react'

import { Progress, ProgressIndicator } from '../../styles/game/LevelProgressBar.style'
import { GameElement } from '../../styles/game/game.style'
import { LevelStar } from './game'

const TRANSITION_TIME = 500

export const LevelProgressBar = ({ level, progress }: { level: number; progress: number }) => {
  const [barProgress, setBarProgress] = useState(0)

  /**
   * Used to track if level changed due to user progression or just due to level being recalculated.
   * For example, if a resource is deleted, the level will change, but there should be no level-up animation.
   * TODO: There must be a better way of managing the animation...
   */
  const hasProgressed = useRef(false)

  /* level-up animation */
  useEffect(() => {
    if (hasProgressed.current) {
      hasProgressed.current = false
      setBarProgress(100)
      const timer = setTimeout(() => {
        setBarProgress(0)
      }, TRANSITION_TIME)
      return () => clearTimeout(timer)
    }
  }, [level])

  /* Progress animation */
  useEffect(() => {
    const timeout = hasProgressed.current ? 0 : 2 * TRANSITION_TIME
    const timer = setTimeout(() => {
      hasProgressed.current = true
      setBarProgress(progress)
    }, timeout)
    return () => clearTimeout(timer)
  }, [progress, level])

  return (
    <GameElement css={{ gap: '0.5rem' }}>
      <LevelStar size={44} level={level} />
      <Progress>
        <ProgressIndicator css={{ transform: `translateX(-${100 - barProgress}%)` }} />
      </Progress>
    </GameElement>
  )
}

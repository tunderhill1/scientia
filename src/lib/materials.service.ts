import Immutable from 'immutable'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router'

import { endpoints } from '../constants/endpoints'
import { AxiosContext, useAxios } from './axios.context'
import { useGame } from './game/game.context'
import { LevelsManager, groupByLevel } from './game/levels.service'
import { useToast } from './toast.context'
import { concatGrouped } from './utilities.service'
import { groupByProperty } from './utilities.service'
import { useYear } from './year.context'

/* TODO: Is there any reason that we do not have a complete Resource/Material type */
export type Resource = { tags: string[]; id: number; category: string }
export type LeveledMaterials = GroupedMaterials[]
export type GroupedMaterials = { [key: string]: Resource[] }

type MaterialsManager = {
  groupedMaterials: GroupedMaterials
  setRawMaterials: (rawMaterials: Resource[]) => void
  isLoaded: () => boolean
  noMaterials: () => boolean
  addCompleteResources: (resourceIds: number[]) => void
  isComplete: (resourceId: number) => boolean
}

export function useMaterials({
  loaded: levelsLoaded,
  selectedLevel,
  hasMinLevels,
  setTotalLevels,
  updateLevel,
}: LevelsManager): MaterialsManager {
  const [rawMaterials, setRawMaterials] = useState<Resource[]>([])

  /* Store materials grouped by level to minimise how often we group materials into levels */
  const [leveledMaterials, setLeveledMaterials] = useState<LeveledMaterials>()
  const [unleveledMaterials, setUnleveledMaterials] = useState<GroupedMaterials>({})

  /* Store complete resources to minimise how often we hit the endpoint */
  const [completeResources, setCompleteResources] = useState<Immutable.Set<number>>()

  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()
  const { includeLevels } = useGame()
  const { moduleCode } = useOutletContext<{ moduleCode: string | null }>()
  const { year } = useYear()
  const { data, loaded: materialsLoaded } = useAxios({
    url: endpoints.resources,
    method: 'GET',
    params: { year, course: moduleCode },
  })

  const groupedMaterials = useMemo(
    () =>
      includeLevels && hasMinLevels
        ? concatGrouped(unleveledMaterials, leveledMaterials?.at(selectedLevel - 1) ?? {})
        : (groupByProperty(rawMaterials, 'category', 'index', true) as GroupedMaterials),
    [includeLevels, rawMaterials, leveledMaterials, unleveledMaterials, selectedLevel, hasMinLevels]
  )

  function isLoaded(): boolean {
    return materialsLoaded && (!includeLevels || levelsLoaded)
  }

  function noMaterials() {
    return Object.keys(groupedMaterials).length === 0
  }

  function isComplete(resourceId: number): boolean {
    return completeResources?.contains(resourceId) ?? false
  }

  async function addCompleteResources(resourceIds: number[]) {
    setCompleteResources(completeResources?.union<number>(resourceIds))
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.resourcesComplete,
        data: resourceIds,
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error completing material' })
        console.error(error)
      })
  }

  /* Group data by category */
  useEffect(() => {
    if (data !== null) setRawMaterials(data)
  }, [data])

  /* Group materials by category */
  useEffect(() => {
    if (includeLevels) {
      const [newLeveledMaterials, newUnleveledMaterials] = groupByLevel(rawMaterials)
      setTotalLevels(newLeveledMaterials.length)
      setUnleveledMaterials(newUnleveledMaterials)
      setLeveledMaterials(newLeveledMaterials)
    }
  }, [includeLevels, rawMaterials, setTotalLevels])

  /* Fetch complete resources */
  useEffect(() => {
    if (includeLevels) {
      axiosInstance
        .request({
          url: endpoints.resourcesComplete,
          method: 'GET',
          params: { course: moduleCode },
        })
        .then(({ data }) => {
          setCompleteResources(Immutable.Set<number>(data))
        })
        .catch((error) => {
          addToast({ variant: 'error', title: 'Error fetching complete materials' })
          console.error(error)
        })
    }
  }, [addToast, includeLevels, axiosInstance, moduleCode])

  /* Update the user level and progress */
  useEffect(() => {
    if (includeLevels && leveledMaterials && completeResources) {
      updateLevel(leveledMaterials, completeResources)
    }
  }, [includeLevels, completeResources, leveledMaterials, updateLevel])

  return {
    groupedMaterials,
    setRawMaterials,
    isLoaded,
    noMaterials,
    addCompleteResources,
    isComplete,
  }
}

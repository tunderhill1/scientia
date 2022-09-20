import { plainToInstance } from 'class-transformer'
import { nextMonday } from 'date-fns'
import { useEffect, useState } from 'react'

import { endpoints } from '../constants/endpoints'
import { Exercise, Term } from '../constants/types'
import { useAxios } from './axios.context'
import { useUser } from './user.context'
import { groupByProperty } from './utilities.service'

export const useTimeline = (year: string): any => {
  const { userDetails } = useUser()
  const [terms, setTerms] = useState<Term[]>([])
  const { data: rawTerms } = useAxios({
    url: endpoints.periods(year),
    method: 'GET',
  })
  useEffect(() => {
    if (rawTerms !== null) {
      setTerms(
        rawTerms.map(({ start, end, ...rest }: any) => ({
          start: nextMonday(new Date(start)),
          end: new Date(end),
          ...rest,
        }))
      )
    }
  }, [rawTerms])

  const [exercises, setExercises] = useState<{ [code: string]: Exercise[] }>({})
  const { data: rawExercises } = useAxios({
    url: endpoints.exercises(year),
    method: 'GET',
    params: { module_code: userDetails?.modules.map((m) => m.code) },
  })
  useEffect(() => {
    if (rawExercises !== null) {
      const deserialisedExercises = rawExercises.map((e: any) => plainToInstance(Exercise, e))
      setExercises(
        groupByProperty(deserialisedExercises, 'moduleCode', 'number') as {
          [code: string]: Exercise[]
        }
      )
    }
  }, [rawExercises])

  return { terms, exercises }
}

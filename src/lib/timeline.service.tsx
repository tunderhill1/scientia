import { plainToInstance } from 'class-transformer'
import { nextMonday } from 'date-fns'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { Exercise, Term } from '../constants/types'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { useUser } from './user.context'
import { groupByProperty } from './utilities.service'

export const useTimeline = (): any => {
  const { userDetails } = useUser()
  const { requestedYear: year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  const [terms, setTerms] = useState<Term[]>([])
  useEffect(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.periods(year!),
      })
      .then(({ data }: { data: any }) => {
        if (!data?.length) setTerms([])
        setTerms(
          data.map(({ start, end, ...rest }: any) => ({
            start: nextMonday(new Date(start)),
            end: new Date(end),
            ...rest,
          }))
        )
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error fetching terms' })
        console.error(error)
      })
  }, [year])

  const [exercises, setExercises] = useState<{ [code: string]: Exercise[] }>({})
  useEffect(() => {
    axiosInstance
      .request({
        url: endpoints.exercises(year!),
        method: 'GET',
        params: { module_code: userDetails?.modules.map((m) => m.code) },
      })
      .then(({ data }: { data: any }) => {
        const deserialisedExercises = data.map((e: any) => plainToInstance(Exercise, e))
        setExercises(
          groupByProperty(deserialisedExercises, 'moduleCode', 'number') as {
            [code: string]: Exercise[]
          }
        )
      })
  }, [year])

  return { terms, exercises }
}

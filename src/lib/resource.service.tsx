import { zonedTimeToUtc } from 'date-fns-tz'
import { useContext } from 'react'
import { useOutletContext } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { LONDON_TIMEZONE } from '../constants/global'
import { ResourceCreate } from '../constants/types'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { groupByProperty } from './utilities.service'
import { useYear } from './year.context'

export const getUTCDatetime = (date: string, time: string) =>
  zonedTimeToUtc(date + ' ' + time, LONDON_TIMEZONE)

export const useResources = (): any => {
  const axiosInstance = useContext(AxiosContext)
  const { year } = useYear()
  const moduleCode = useOutletContext<string | null>()
  const { addToast } = useToast()

  const uploadResource = async (
    { file, ...resource }: ResourceCreate,
    setGroupedMaterials: any
  ) => {
    await axiosInstance
      .request({
        method: 'POST',
        url: endpoints.resources,
        data: {
          ...resource,
          year: year.toString(),
          course: moduleCode,
        },
      })
      .then(({ data }: any) => {
        if (resource.type === 'file') {
          let formData = new FormData()
          formData.append('file', file!)
          axiosInstance
            .request({
              method: 'PUT',
              url: endpoints.resources + '/' + data.id + '/file',
              data: formData,
            })
            .catch((error: any) => {
              addToast({
                variant: 'error',
                title: 'Error uploading file' + file?.name ? `'${file?.name}'.` : '.',
              })
              console.error(error)
            })
        }
      })
      .then(() => {
        axiosInstance
          .request({
            method: 'GET',
            url: endpoints.resources,
            params: { year, course: moduleCode },
          })
          .then(({ data }: any) => setGroupedMaterials(groupByProperty(data, 'category', 'index')))
          .catch((error: any) => {
            // TODO: When would this fail, what errors would catch here?
            // do we want to extract this callback somewhere else?
            console.error(error)
          })
      })
      .catch((error: any) => {
        addToast({ variant: 'error', title: `Error creating resource '${resource.title}'.` })
        console.error(error)
      })
  }
  return { uploadResource }
}

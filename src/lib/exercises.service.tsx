import { useContext } from 'react'

import { FileToSubmit } from '../components/dialogs/ExerciseDialog'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'

export const useExercises = (): any => {
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  const getExerciseMaterials = async ({
    academicYear,
    yearGroup,
    setExerciseMaterials,
    exerciseId,
  }: any) => {
    await axiosInstance
      .request({
        method: 'GET',
        url: `/${academicYear}/${yearGroup}/exercises/${exerciseId}/files`,
      })
      .then(({ data }: any) => setExerciseMaterials(data))
      .catch((error: any) => {
        addToast({
          variant: 'error',
          title: 'There was an error fetching the materials for this exercise',
        })
        console.error(error)
      })
  }

  const submitFile = (file: FileToSubmit) => {
    console.log('Uploading: ', { file })
  }

  const deleteFile = (file: FileToSubmit) => {
    console.log('Deleting: ', { file })
  }

  return { getExerciseMaterials, submitFile, deleteFile }
}
